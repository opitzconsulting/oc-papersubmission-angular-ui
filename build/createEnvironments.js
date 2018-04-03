const exec = require('child_process').exec;
const fs = require('fs');

const isProd = process.argv.includes('--prod');
const overwritesBaseURL = process.argv.includes('--base-url');
const stackNameParameter = process.argv.includes('--api-stack-name');

const prod =  isProd ? 'prod.' : '';
let baseUrl = 'http://localhost:4200';

if(overwritesBaseURL) {
  baseUrl = process.argv[process.argv.indexOf('--base-url') + 1];
}

let stackName = '';
if(!stackNameParameter) {
  console.log("api-stack-name Parameter missing");
  return -1;
} else {
  stackName = process.argv[process.argv.indexOf('--api-stack-name') + 1];
}


exec(`aws cloudformation describe-stacks --stack-name ${stackName} --query 'Stacks[0].Outputs[*].{key:OutputKey value:OutputValue}'`, (error, stdout, stderr) => {
  const result = JSON.parse(stdout);

  let template = fs.readFileSync('./environment.template', "utf8");
  result.forEach(parameter => {
    template = template.replace(new RegExp(parameter.key.toUpperCase(), 'g'), parameter.value);
  });

  template = template.replace('BASEURL', baseUrl);
  template = template.replace('ISPROD', isProd);

  const file = fs.createWriteStream(`./../src/environments/environment.${prod}ts`);
  file.end(template);

  console.log('Environment File created');
});


