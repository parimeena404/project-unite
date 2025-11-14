type Issue = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
};

const issues: Issue[] = [
  { id: "1", title: "Connectivity in underserved regions", description: "Improve mesh networks", tags: ["connectivity"] },
  { id: "2", title: "Digital literacy gap", description: "Educational programs needed", tags: ["education"] },
];

export default {
  issues,
  getIssues: () => issues,
  getIssue: (id: string) => issues.find((i) => i.id === id),
  addIssue: (issue: Issue) => {
    issues.push(issue);
    return issue;
  },
};
