import ArgoCD from './argo-cd';
import * as context from './context';

import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    core.startGroup(`ArgoCD`);

    const inputs: context.Inputs = await context.getInputs();

    // Get executable
    const argocd = await ArgoCD.getOrDownload(inputs.version);

    const args = await context.getArgs(inputs);
    if (args) {
      const result = await exec.getExecOutput(argocd.path, args);
      if (result.stderr.length > 0 && result.exitCode != 0) {
        throw new Error(`[debug(argocd-action)] failed with: ${result.stderr}`);
      }
      core.setOutput('output', result);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
  core.endGroup();
}

run();
