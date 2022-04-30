import * as core from '@actions/core';
import * as github from '@actions/github';
import { parse } from 'csv-parse';

let _defaultContext: string;

export interface Inputs {
  commands: string[];
  version: string;
}

export function defaultContext(): string {
  if (!_defaultContext) {
    let ref = github.context.ref;
    if (github.context.sha && ref && !ref.startsWith('refs/')) {
      ref = `refs/heads/${github.context.ref}`;
    }
    if (github.context.sha && !ref.startsWith(`refs/pull/`)) {
      ref = github.context.sha;
    }
    const gitHubBaseUrl = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}`;
    _defaultContext = `${gitHubBaseUrl}/${github.context.repo.owner}/${github.context.repo.repo}.git#${ref}`;
  }
  return _defaultContext;
}

export async function getInputs(): Promise<Inputs> {
  return {
    version: core.getInput('version'),
    commands: await getInputList('commands'),
  };
}

export async function getInputList(name: string, ignoreComma?: boolean): Promise<string[]> {
  const res: Array<string> = [];

  const items = core.getInput(name);
  if (items == '') {
    return res;
  }

  const records = await parse(items, {
    columns: false,
    relaxQuotes: true,
    relaxColumnCount: true,
    skipEmptyLines: true,
  });

  for (const record of records as unknown as Array<string[]>) {
    if (record.length == 1) {
      res.push(record[0]);
      continue;
    } else if (!ignoreComma) {
      res.push(...record);
      continue;
    }
    res.push(record.join(','));
  }

  return res.filter(item => item).map(pat => pat.trim());
}

export async function getArgs(inputs: Inputs): Promise<Array<string>> {
  // prettier-ignore
  return [
    'argocd',
    ...inputs.commands
  ];
}
