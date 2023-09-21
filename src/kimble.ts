import * as fs from "fs";
import { KimbleProject } from "./KimbleProject";

export function getKimbleProject(jiraIssue: string): KimbleProject {
  // Load the Kimble projects from a JSON file
  const kimbleProjectsJSON = fs.readFileSync("kimbleProjects.json", "utf-8");
  const kimbleProjects = JSON.parse(kimbleProjectsJSON).kimbleProjects;

  // First, look for a mapping on the specific Jira issue
  for (const project of kimbleProjects) {
    for (const mapping of project.jiraMappings) {
      if (mapping.type === "jiraIssue" && jiraIssue === mapping.value) {
        return { kimbleCode: project.code, kimbleProjectName: project.projectName };
      }
    }
  }

  // If no specific Jira issue mapping is found, look for a Jira prefix mapping
  for (const project of kimbleProjects) {
    for (const mapping of project.jiraMappings) {
      if (mapping.type === "jiraPrefix" &&
        jiraIssue.startsWith(mapping.value)) {
        return { kimbleCode: project.code, kimbleProjectName: project.projectName };
      }
    }
  }

  return { kimbleCode: 'noKimbleCodeFound', kimbleProjectName: 'No Kimble code found' }; // No matching Kimble project found
}
