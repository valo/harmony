---
title: Falling in love with git
layout: post
comments: true
tags:
  - git
---

I few weeks ago I decided to try to use [git](http://en.wikipedia.org/wiki/Git_(software)) in my everyday workflow. In [DreamBox](http://www.dreambox.com) we are using SVN, so I had to use git-svn.

To be honest, first it was hard. The main problem was to get the ideas behind git and to find the right commands for doing the everyday stuff. After several days of working with it I really fell in love. Now I am using it as my main version control system. What I really like is that I can easily branch the code and start working on something experimental and at the moment I decide that it is ready to be integrated in the product I just merge it in the main code branch with the whole history of developing it. The other great thing is that I have the *whole* history on my machine and I can work offline.

But, there are some weaknesses, particularly in the git-svn bridge, which definitely need some more work. The major one is the support for external repositories. Right now there is no support for that in git-svn, so I had to make a separate repository for each external one. After that I wrote a script for updating the whole repo. Here is the code:

    #/bin/bash

    DIRS="git-repo-1 git-repo-2 git-repo-3"

    for d in $DIRS; do
    pushd $d > /dev/null

    # Search for sub repositories
    for subd in `find . -iname .git`; do
    echo "**** START ****"
    pushd $subd
    cd ..

    CHANGES=`git status | grep 'working directory clean'`

    if [[ $CHANGES ]]; then
      git svn rebase
    else
      git stash && git svn rebase && git stash apply
    fi

    if [[ ! $? ]]; then
      echo "Error updaing $d!"
      exit 1
    fi

    popd
    echo "**** END ****"
    done

    popd > /dev/null
    done

This bash script will go through a list of repositories (in the example these are git-repo-1, git-repo-2...) and will search for sub-repositories in their tree. If it finds any, it will stash the current changes (if any) and will rebase the code with the latest one. I requires some mode polishing, but as a whole it is working well.

The other weaknesses are that the GUI tools for working with git are not as many as the ones for SVN and also they are not so pretty-looking. This is a problem for people, who are not developers and are used to work with nice visual tools (in our company there are lots of them). For people, like me, who are used to work from command line this is not a problem.

The other problem, which I am concerned about is the windows support for git. I didn't have the time to investigate that, because it will require me to install windows, but I see that there are a lot of effort thrown in that direction. I hope that the support is good, because many people are using windows as a development platform. Unfortunately I am a little bit doubtful about that and I will expect to have problems with the windows port.
