import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

async function run(): Promise<void> {
  try {
    const tag = core.getInput('version')
    if (semver.valid(tag) == null) {
      core.setFailed(
        `Tag ${tag} does not appear to be a valid semantic version`
      )
      return
    }
    console.log(semver.valid(tag))
    const client = github.getOctokit(core.getInput('token'))
    console.log('************github.context.repo')
    console.log(github.context)
    const tag_rsp = await client.git.createTag({
      ...github.context.repo,
      tag,
      message: core.getInput('message'),
      object: github.context.sha,
      type: 'commit'
    })
    if (tag_rsp.status !== 201) {
      core.setFailed(`Failed to create tag object (status=${tag_rsp.status})`)
      return
    }
    console.log(tag_rsp)
    const ref_rsp = await client.git.createRef({
      ...github.context.repo,
      ref: `refs/tags/${tag}`,
      sha: tag_rsp.data.sha
    })
    if (ref_rsp.status !== 201) {
      core.setFailed(`Failed to create tag ref(status = ${tag_rsp.status})`)
      return
    }
    console.log(ref_rsp)
    core.info(`Tagged ${tag_rsp.data.sha} as ${tag}`);
    
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();