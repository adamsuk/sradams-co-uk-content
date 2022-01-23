---
title: "Gitlab Commit 2020 Proposal"
date: "2021-03-26"
tags: "DevOps, Career, Conferences"
description: "The proposal I sent of to Gitlab to get a speaker slot at Gitlab Commit 2020. It's a little self deprecating but ultimately true regarding my early career."
cover_image: ''
canonical_url: null
published: false
---
```
scott@rolls-royce:~$ ./introduction.sh
Hi, I'm Scott. I'm a Physicst by education, engineer on paper, and software 
developer in practice. My current position is Performance Methods Lead for the 
Rolls-Royce led UK SMR programme. I'd like to briefly outline the beginning of 
our DevOps journey.
scott@rolls-royce:~$ python at_the_beginning.py
So my first interactions with the UK SMR programme was 4 years ago as the new 
kid on the block in a small team task with developing a "cutting edge" analysis 
method to deliver results for a budding nuclear reactor design at a stage of 
design analysis had never fed into before. As the SMR programme was ramping up 
we remained in our current department at another location in Rolls-Royce. So we 
stood of the shoulders of our departments successes and aimed to push the 
boundaries. I don't want to down play our successes at this stage (because various 
papers and talks at nuclear conferences have been given on them) but if I shared 
our plans, developments and first release with anyone from a software background 
we'd have been laughed at, for quite some time.
scott@rolls-royce:~$ python at_the_beginning.py --summary
- siloed, internet isolated network on an aging system (by our own standards).
- minimal software development knowledge in the team (dabbled in C).
- predominantly python 2.4
- gedit (Linux side), jEdit (Windows side)
- waterfall development (8 months end-to-end)
- limited customer engagement (zero by the actual developers)
- codes needed to do our job (although old and worn, they worked) 
scott@rolls-royce:~$ python -m unittest tests/test_at_the_beginning.py
....F..F..FF
FAILED:
- customer requirements not met
- analysis method delivered late
- overspent
- zero configuration control (unless you claim chmod r+x ... which we did)
- god-dam carriage returns!
scott@rolls-royce:~$ ssh scott@smr
scott@smr:~$ nano migration_summary.txt
So at this stage we've released!  We've migrated (onto on-premise engineering
Windows-based PCs).  We utilised Anacoda! Moved to Python 2.7 (latest company
approved version). Adopted less configuration management (no approved tool
on Windows).  We operated a Operational Support Plan which aimed to "quickly"
update the method (with an update being no less than 400 engineering-hours).
We began to unittest our code with our common team IDE being Notepad++.  We
begin to track required changes to the method using Excel to sanction changes.
scott@smr:~$ source brexit
scott@smr:~$ echo PROGRAMME_STATUS
As a result of Brexit the team I'm part of deminished to zero over a period of ~2 years.
scott@smr:~$ shutdown



Last login: Weds 31 16:44:54 2018
scott@smr:~$ echo PROGRAMME_STATUS
After a substantial time away from the programme (working on other waterfall
projects) I returned as Performance Methods Lead.  I was the first of 5 team
members to be deployed onto the programme (mid-Fed 2020).
scott@smr:~$ nano covid
set REMOTE_WORKING = True
set REQUIRED_CAPABILITY = False
set WORK_DEMAND_PROFILE = 'LINEARLY INCREASING - OUT OF CONTROL'
scott@smr:~$ source covid
scott@smr:~$ shutdown



scott@home:~$ editor action_plan_a.docx
During the first few weeks I pulled together an action plan to get my teams
capability back up and running.  There was an intention to utilise modern
tools and alternative IT provisions to make ambitious code coupling intentions
possible.  Covid was my catylst. Plan:
1. Remove development IT provisions from the office
2. Repurpose this IT with Ubuntu to host an development/analysis network
3. Host a 'head node' to ensure all nodes have a centralised store
4. Use this 'head node' to host:
   - MySQL for sensitive data
   - Puppet to ensure common tools and required certificates on clients
   - GitLab to manage method developments and analysis inputs
5. All 'head node' servers are to be used in Docker to ease hosting each
   individual service.
scott@home:~$ cd initial_devops && docker-compose up -d
scott@home:~/initial_devops$ cat shared_vol/current_state
This initial server/client approach, utilising DevOps tools has worked
better than ever envisaged!  Our workload looked ever increasing before
hand as a result of being under-resourced but now every member of the team
works predominantly on their Ubuntu client node.  We regularly commit 
code and analysis input changes (along with using it to share other tools
too!).  We've now moved our change request register to GitLab Issues,
utilise the board for assigning development tasks.  2 months in we've:
- kept up with our work demand, whilst enabling remote working
- configuration controlled our method (including historic releases)
- altered the method to work on Ubuntu with MySQL
- added end-to-end encryption and restricted users to read_only data
- rebasedline our method following the programme hiatus
- utilised branches and merge requests to technically check the changes
- began to develop automated documentation (rather than the typical
  documents seen in waterfall approaches)
- expanded the network to 2 physicsts in the programme
- built another analysis code from source (doubling our code-base)
- kept up with analysis demands
- began to scope cross-method interactions
scott@home:~/initial_devops$ curl --header "PRIVATE-TOKEN: WorthMoreThanMyPIN"
 "https://smr:1234/api/v4/issues?" | jq '.[0].title'
"Further develop our DevOps principles"
"Utilse CI/CD for all testing requirements"
"Use tools to build the method into a Docker image for use across platforms"
"Lock down branches to enforce mandated QA approahces"
"Futher automate our documentation"
"Utilise pipelines for testing purposes between branches"
"Push method into the cloud and scale to meet analysis requirements"
"Bring everyone else along with us"
scott@home:~$ echo HAPPINESS
Extremely, thanks to GitLab.
```