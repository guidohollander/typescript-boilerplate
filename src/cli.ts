#!/usr/bin/env node
import * as dotenv from "dotenv";
import { getJiraWorkLogList, getJiraIssue } from "./jira";
import { getKimbleProject } from "./kimble";
import { formatTimeSpent, formatDate2 } from "./formatters";
import { WorkLog } from "./types/interfaces";

// Ensure required environment variables are set (not applicable in TypeScript, but you can add checks)
dotenv.config();
export const jiraUsername: string = process.env.JIRA_USERNAME || "";
export const jiraPassword: string = process.env.JIRA_PASSWORD || "";
export const jiraBaseUrl: string = process.env.JIRA_BASEURL || "";

const WorkLogs: WorkLog[] = []; // Initialize the array

(async () => {
  try {

    // copy this string from Kimble header
    const dateRangeString = process.argv[2] // "9/18/2023 to 9/24/2023";

    if (!dateRangeString) {
      console.error("Date range string is missing. Please provide it as a command-line argument.");
      process.exit(1); // Exit with an error code
    }

    // Split the date range string into two parts
    const [startDateStr, endDateStr] = dateRangeString.split(" to ");
    
    // Parse the date strings into Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Format the Date objects into "YYYY-MM-DD" strings
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    
    // Result dates to use for Jira calls
    const dateStart = formatDate(startDate);
    const dateEnd = formatDate(endDate);

    // Get list if applicable jira issues where current user has worklogs
    const jiraListResponse = await getJiraWorkLogList([dateStart, dateEnd]);

    if (jiraListResponse) {
      // Initialize an array to hold Promises for fetching worklogs
      const fetchPromises: Promise<void>[] = [];

      // Iterate through issues and worklogs
      jiraListResponse.issues.forEach((issue) => {
        const fetchPromise = (async () => {
          // Get jira issue worklog details
          const jiraIssue = await getJiraIssue(issue.key);
          let epicKey = undefined;
          let epicDescription = "";

          // get epicKey, from issue or from parent issue
          if (jiraIssue.fields.customfield_10008) {
            epicKey = jiraIssue.fields.customfield_10008;
          }

          // find parent if there's no epic yet
          if (
            !epicKey &&
            jiraIssue &&
            jiraIssue.fields &&
            jiraIssue.fields.parent &&
            jiraIssue.fields.parent.key
          ) {
            // Get parent jira issue for epic if issue has parent (specically for subtask issues)
            const jiraIssueParent = await getJiraIssue(
              jiraIssue.fields.parent.key
            );
            if (
              jiraIssueParent &&
              jiraIssueParent.fields &&
              jiraIssueParent.fields.customfield_10008
            ) {
              epicKey = jiraIssueParent.fields.customfield_10008;
            }
          }

          // get epic data if key is available
          if (epicKey) {
            const jiraIssueParentEpic = await getJiraIssue(epicKey);
            epicDescription = jiraIssueParentEpic.fields.description;
          } else {
            epicDescription = jiraIssue.fields.description;
          }
          
          // Get and filter worklogs for only the current user and push gathered info the 
          await jiraIssue.fields.worklog.worklogs.forEach(
            async (worklog: any) => {
              if (
                worklog.author.key === jiraUsername &&
                new Date(worklog.started) >= new Date(dateStart) &&
                new Date(worklog.started) <= new Date(dateEnd)
              ) {

                const kimbleObject = getKimbleProject(issue.key)

                WorkLogs.push({
                  workLogDate: new Date(worklog.started),
                  workLogHours: formatTimeSpent(worklog.timeSpentSeconds),
                  jiraIssueNumber: issue.key,
                  jiraIssueEpic: epicDescription,
                  kimbleCode: kimbleObject.kimbleCode,
                  kimbleDescription: kimbleObject.kimbleProjectName
                });
              }
            }
          );
        })();

        fetchPromises.push(fetchPromise);
      });

      // Wait for all fetchPromises to resolve before sorting and logging
      Promise.all(fetchPromises)
        .then(() => {
          // Sort the array by kimbleCode and then by workLogDate
          const sortedArray = WorkLogs.sort((a, b) => {
            // Compare by kimbleCode
            if (a.kimbleDescription < b.kimbleDescription) {
              return -1;
            } else if (a.kimbleDescription > b.kimbleDescription) {
              return 1;
            }

            // If kimbleDescription is the same, compare by workLogDate
            return a.workLogDate.getTime() - b.workLogDate.getTime();
          });

          // Output the sorted array
          sortedArray.forEach((worklog) => {
            console.log('worklog:', `${worklog.kimbleDescription.padEnd(90, " ")} | ${formatDate2(worklog.workLogDate)} | ${worklog.workLogHours.padEnd(6, " ")} | ${worklog.jiraIssueEpic.padEnd(50, " ")} | ${worklog.jiraIssueNumber.padEnd(10, " ")} | ${jiraBaseUrl}/browse/${worklog.jiraIssueNumber.padEnd(10, " ")}`);
          })
          console.log('');
          console.log('Find the corresponding Kimble code, then copy and past the hours, epic and issue code in the correct date field. For reference, ctrl-click the URL');
        
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();


