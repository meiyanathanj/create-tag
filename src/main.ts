import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

async function run(): Promise<void> {
  try {
    let tag = 'v1.0.0';//core.getInput('version')
    const token = '';//core.getInput('token');
    const tagprefix = 'v';
    
    if (semver.valid(tag) == null) {
      core.setFailed(
        `Tag ${tag} does not appear to be a valid semantic version`
      )
      return
    }
return;
    let verregx = /^(\d+\.)?(\d+\.)?(\d+)$/
    let tagres = verregx.test(tag);
    if(tagres){
      tag = `${tagprefix}${tag}`;
    }
   
    const client = github.getOctokit(token)

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

    const ref_rsp = await client.git.createRef({
      ...github.context.repo,
      ref: `refs/tags/${tag}`,
      sha: tag_rsp.data.sha
    })
    if (ref_rsp.status !== 201) {
      core.setFailed(`Failed to create tag ref(status = ${tag_rsp.status})`)
      return
    }

    core.info(`Tagged ${tag_rsp.data.sha} as ${tag}`);
    core.setOutput('latesttag', tag)
    if(tag){ 
      core.setOutput('status', 'Success')
    }else{
      core.setOutput('status', 'Failure')
    }
    
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();