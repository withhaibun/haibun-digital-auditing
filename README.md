# haibun-digital-auditing

Haibun Digital Auditing is a module incorporating Haibun's integration and testing with that of Sustainability, a methodology for assessing the sustainability of digital services.

## Installation

Normally, libraries from this repository will be included in a project like any other, or used via the cli, for example, using `npx @haibun/cli`. For more information you can visit `Haibun` at `https://github.com/withhaibun/haibun`

### Sustainability  

Sustainability is a testing ruleset that proposes auditing for environmentally sustainable transformation of digital resources.

### Playwright-Axe 

Playwright-Axe is a Node library that combines the efforts of playwright and sustainability to conduct green tests. 

To download playwright: 

`npm i-D @playwright/test`

To download playwright-axe: 

`npm i-D axe-playwright`

After the installation, the modules in this repository can be used freely. 

# Developing haibun-digital-auditing

Installation uses a shell script, which is tested in Linux & macOS,
and should also work on Windows using WSL.

Clone the repo, 
and install Lerna and Typescript globally;

`npm i -g lerna typescript`

To run and test:

  `npx playwright test`


## Developing modules and Haibun core together

To develop your separate module while developing Haibun modules, use:

`npm link @haibun/core`

and any other modules you may need.
 
