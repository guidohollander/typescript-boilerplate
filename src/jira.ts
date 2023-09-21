import axios from 'axios';
import { jiraBaseUrl, jiraUsername, jiraPassword } from './cli';

// Define the API endpoint URL for the initial search using the calculated or provided date range
//const initialApiUrl = `${jiraBaseUrl}/rest/api/latest/search?jql=worklogAuthor = currentUser() and worklogDate>='${dateRange[0]}' and worklogDate<='${dateRange[1]}'&expand=renderedFields`;
interface JiraListResponse {
  issues: [{
    id: string;
    key: string;
    self: string;
  }]
}


export async function getJiraWorkLogList(dateRange: [string, string]): Promise<JiraListResponse | undefined> {
  try {
    // Construct the JQL query
    const jql = `worklogAuthor = currentUser() and worklogDate>='${dateRange[0]}' and worklogDate<='${dateRange[1]}'`;
    // Construct the full URL
    const url = `${jiraBaseUrl}/rest/api/latest/search?jql=${encodeURIComponent(jql)}&expand=renderedFields`;
    // Make the Axios GET request
    const response = await axios.get(url, {
      auth: {
        username: jiraUsername,
        password: jiraPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}
export async function getJiraIssue(issueKey: string): Promise<any | undefined> {
  try {
    // Construct the full URL
    const url = `${jiraBaseUrl}/rest/api/latest/issue/${issueKey}?expand=worklog`;
    // Make the Axios GET request
    const response = await axios.get(url, {
      auth: {
        username: jiraUsername,
        password: jiraPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}