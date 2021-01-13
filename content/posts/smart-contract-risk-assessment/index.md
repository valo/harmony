---
title: Smart Contract Risk Assessment
author: Valentin Mihov
date: 2020-12-20
hero: ./images/hero.jpg
excerpt: One of the most important aspects of DeFi investing and yield farming is the risk assessment of the smart contract where the funds are being put.
---

Photo credit: <a href="https://unsplash.com/@charlesdeluvio?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Charles Deluvio</a> on <a href="https://unsplash.com/s/photos/code-review?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>

One of the most important aspects of DeFi investing and yield farming is the risk assessment of the smart contract where the funds are being put. During 2020 there were multiple hacks, which exploited vulnerabilities in the DeFi protocols, leading to millions of dollars lost by the depositors. I've been involved in smart contract risk assessment since the DeFi craze started. Before that I was a CTO in the blockchain analytics company [Santiment Network](https://santiment.net/). The time at Santiment helped me dive into a lot of Ethereum smart contract code and gain experience in analyzing and understanding the emerging DeFi protocols.

There are two main smart contract risks which DeFi investors should be looking for: scams (a.k.a. "rug pulls") and bugs/vulnerabilities. Let's first dive into the easier one: scams.

## Scams

As the DeFi ecosystem is growing exponentially, the amount of scammers trying to profit quickly increases. The scams have different form and approach to stealing money. In many cases the scammers fork an existing popular DeFi protocol and market it as a new alternative. They offer tempting rewards for everyone that deposit in the protocol in the form of crazy returns, usually reaching to values like 10000% annually. The rewards are usually paid in form of a new governance token, which is created by the scammers. The key differentiation here is that the scammers modify the source code of the forked protocol and include some kind of mechanism which allows them to drain the deposited funds in an address that they control. The so called "rug pull" mechanism is either a function, which a privileged address can call or a lack of a timelock protection of an important privileged mechanism.

Usually these protocols does not attract a lot of funds in them, as the backdoors are obvious for the experienced security experts. The amount of funds being stolen in such a scam is usually under \$500,000, which is smaller compared to vulnerability exploits or centralized exchange hacks, but still they are very painful for the victims. Especially when they are easily preventable if you have an expert you can ask about the safety of a given protocol.

https://twitter.com/valentinmihov/status/1330478266252144640

The biggest scam that happened in 2020 was Compounder, which managed to steal around $12 million. In this situation the anonymous developer made a fork of the [yEarn Vault](https://yearn.finance/vaults) smart contract system and incentivized the participants to deposit liquidity by giving away a large amount of the newly created governance token $CP3R. The protocol operated for about a month, until the developer submitted a malicious changes into its Timelock. The timelocks are put in place so that the participants in the protocol has time to review the changes and withdraw their funds. In this case nobody was paying attention to the changes submitted in the Timelock and after 24 hours the changes went into force, allowing the dev to drain all the funds from the protocols.

https://twitter.com/valentinmihov/status/1333817662338699265

The sad part of the story is that depositors had 24 hours to see the submitted changes and withdraw their funds, but nobody was paying attention. This is why it is important to monitor each Timelock contract of the protocols you put funds into and review any changes submitted there.

## Bugs and vulnerabilities

The second type of problems, which could lead to losing funds in DeFi are bugs and vulnerabilities in the smart contracts. These are problems, which were not added in purpose by the developers, but could lead to hackers exploiting them and stealing funds. One of the most frequent vulnerabilities is an oracle sandwich attack. In this attack a special smart contract is deployed, which makes several steps in a single transaction:

1. Make one or more flash loans borrowing millions of dollars of tokens
2. Manipulate the price of some tokens on exchanges like Uniswap by swapping the borrowed assets
3. Execute some actions in the victim protocol, which at this point sees the manipulated prices
4. Buy back the borrowed assets and return the market prices to the normal levels
5. Return the flash loans

After this sequence of steps the hacker is left with huge amount of profits, as the victim protocol use a manipulated price for making its calculations and thus allowing the attacker to be left with more funds, than he should be. This makes the protocol insolvent and causes the depositors to lose part or all of their investment.

https://twitter.com/valentinmihov/status/1320667338321154048

Although the vulnerability is well known it is not always easy to detect it when reviewing the code. In many cases the DeFi protocols are very complicated or work with other complex money legos, like baskets of tokens. This is why detecting these problems during a security review is hard and usually the person that finds the problem is also going to exploit it. If the person is with good intentions he returns the funds to the protocol after the bug is fixed, but in most cases the money are gone and the depositors never see their funds again.

In order to mitigate risk against such bugs it's very important to make a good assessment of the complexity of the new protocols. Things to look for:

- leveraged positions
- pricing complex tokens, like baskets of stables
- plug-able architectures that allow forwarding the deposited funds around different places (a.k.a. vaults)

The safer protocols are the ones that has been around longer, like yEarn Vaults, Uniswap, Aave, Compound. Keep in mind that even in these cases, there are problems popping up. For example Aave saw a security problem being disclosed after many months of operating.

https://twitter.com/trailofbits/status/1339239357132251136

## Conclusion

As you can see there are smart contract risks which can be found quite easily by an expert and there are other problems, which are more tricky to detect and usually remain un-noticed. The hardest pat is to assess the unknown risks and try to be level headed about the protocols you invest into. I am thoroughly reviewing each protocol my clients and I are investing into. So far there hasn't been a single instance of funds being lost due to a scam or a bug in my investments. You can see how a professional security review looks like from my report on Dracula Protocol:

https://twitter.com/valentinmihov/status/1317120493577768960

Wish you profitable farming and be careful out there! If you have questions you can contract me on twitter: https://twitter.com/valentinmihov
