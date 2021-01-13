---
title: DeFi Investing & Yield Farming
author: Valentin Mihov
date: 2021-01-03
hero: ./images/hero.jpg
excerpt:
---

Photo by <a href="https://unsplash.com/@micheile?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Micheile Henderson</a> on <a href="https://unsplash.com/s/photos/money?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>

During the summer of 2020, a new trend picked up in the blockchain world: yield farming. The term "yield farming" is used
to describe the activity of finding opportunities and deploying capital via smart contracts in order to receive a high yield on that capital.
Example of such opportunities are decentralized lending protocols, like [Compound](https://compound.finance). These protocols allow users to deposit funds (collateral) that are then lent out to borrowers who pay interest on the loans. The interest is paid back to the participants who provide the collateral, known as "liquidity providers".

This is similar to being a shareholder in a bank and getting dividends from the revenue
of the bank. The main difference is that the bank will be keeping a large margin on the revenue while in the DeFi world most of the revenue is paid out to the liquidity providers.

There are several dimensions in yield farming that one need to take into consideration when evaluating a new opportunity
:

- smart contract risk
- protocol level yield
- subsidized yield
- size of the market
- price risk
- gas costs

Let's look at each of these factors.

## Smart contract risk

There are often security problems smart contracts that could lead to 100% loss of funds,
something very hard to recover from. Generally older protocols are more secure compared to the newer ones. Also more complex
systems are more prone to bugs compared to simple protocols. Another rule of thumb is that protocols, which interact with
a lot of other systems and has a lot of dependencies, like external oracles, are more prone to exploits.

The topic of smart contract security is broad and I have written another article about it: [Smart Contract Risk Assessment](/smart-contract-risk-assessment) Check it out to get a better understanding of the different types of smart contract risk.

## Protocol level yield

It is important to understand how a DeFi protocol is generating revenue. [Uniswap](https://uniswap.exchange), for example, is a decentralized exchange charging 0.3% on each trade. If you provide liquidity in this protocol, you will be earning your share of the collected fees. In this particular case it is important to identify the trading pairs, which generate the most amount of volume and compare that to the liquidity of the pair. The pairs with the best volume/liquidity ratio provide the best yield.

If a given protocol is not generating revenue, this is a red flag and perhaps the protocol is a scam or won't last as long.

## Subsidized yield

Many times, when a new protocol launches it needs to attract liquidity. In order to do that, the developers of the protocol
incentivize the liquidity providers to put their money in the protocol and give them back a governance token. The
developers make sure there is a market for the new token so that the rewards can be cashed out. By making this subsidy,
the protocol is able to bootstrap its liquidity and it is usually a nice opportunity to earn extra yield on your funds.

Finding such opportunities takes some work. It requires keeping an eye on a lot of information channels and spending
time staying up to date with the latest subsidy programs, the price of the reward tokens and re-balancing between all of the opportunities.

On the other hand, such subsidized programs can offer very lucrative yields ranging from 30% APR up to crazy 5000%+ APR without
a lot of price risk (on stablecoin funds). Usually the high yield of such programs doesn't last long as the capital floods in
and dilutes the rewards, so it is important to onboard early.

## Size of the market

The size of the market is the total value locked in a particular protocol (a.k.a. TVL). This number is important because, usually, the amount of rewards being paid out is fixed and it is distributed across all depositors.

For example, if a given opportunity is paying 100% APR on a TVL of \$1_000_000, if someone deposits 1 million dollars into the protocol, the APR will drop in half (50% APR). Keep an eye on the TVL and make sure you understand the change of the APR when you deposit. This is usually a problem that larger depositors need to keep in mind, but all depositors need to check back as the APR changes tend to vary quite a bit from day to day.

In some cases it is possible that the TVL is so small that there is no point in investing at all. Putting a meaningful sum into the protocol will dilute the APR too much. This is especially true for opportunities that has been around for a long time and are already "farmed out".

## Price risk

Which of asset you need to deposit into the protocol is very important when evaluating a yield farming opportunity. In most cases, the highest yield is offered on assets that carry a high price risk. For example, if Compound offers 50% annual yield on depositing $BAT tokens, you need to keep in mind that the price of $BAT might drop over 50% during the year, offseting the yield and even causing loss in your portfolio in USD terms.

Imagine the current price of $BAT is $1 and you deposit $1000. In one year your potential yield is $500. But if the price of $BAT drops to $0.5, then your principal will be $500 and the yield you would have earned will be less than $500. Your total portfolio will be below \$1000 and you would have realized a net loss.

There are a couple of ways to mitigate the above price risk:

- Try not to buy tokens in order to farm. Buying the tokens exposes you 100% to their price risk
- If you able to borrow the tokens, try to do that. Be cautious about the interest of your loan as it decreases the total APR you are earning.
- If you buy the tokens, try to hedge them by making a short position against them. This is usually only possible on a centralized exchange.

## Gas costs

When you invest into a given opportunity, the next question is: how often to claim the rewards and what to do with them. The frequency of claiming the rewards is determined by the gas costs of claiming them. Each transaction on the Ethereum blockchain costs money and in cases of high congestion these "taxes" are quite high. I usually recommend not to spend more than 5-10% of the claimed rewards in gas costs. That means that if the transaction cost for claiming the rewards, selling them and reinvesting is $10 in gas costs, the size of the claimed rewards should be at least $100-200 in order for it to be worthwhile.

The above rule will determine the frequency of claiming rewards. If you have a large position with a high yield you might be able to claim the rewards several times a day. On the other hand if your position is small it might be better to do the claim once every 2-3 days.

The gas costs are also connected with what exactly you do with the rewards after you claim them. One very simple strategy is to sell them for some stablecoin like $USDC. Another is to buy more of the token you farm with and stake them into the farm. A third option is to convert them to $ETH. The decision on what to do with the farmed rewards is determined by your investment thesis and your general strategy.

## Conclusion

Yield farming has evolved a lot in 2020. Personally I was not expecting the yield opportunities to continue for so long, but it looks like there are more and more DeFi projects being rolled out. All of these projects are competing for liquidity and in many cases offering rewards for the people willing to put their funds in them. As you navigate the universe of opportunities, don't forget to keep in mind the above points. Try to be level headed about the levels of risk you are taking. Keep in mind that many of these opportunities are zero-sum games, so if someone is winning, someone else is losing money. The correct balance between risk and reward are going to make you successful.

If you have questions you can contact me on twitter: https://twitter.com/valentinmihov
