---
layout: post
title: Hacking the package TTL with DD-WRT
comments: true
tags:
  - networking
---

Some ISPs are changing the TTL of the packets going to their customers to protect from splitting the network accounts to several people. This could be quite annoying when a person wants to use a wireless router, so she could use her laptop/ipod/whatever-you-like from every point in the house. Of course there is a solution. Here is mine:

1. Get a Linksys WRT54GL wireless router (it runs linux!!!)

2. Install <a href="http://dd-wrt.com">DD-WRT</a> firmware on it
  
3. Go to the web interface of the router (usually http://192.168.1.1). Go to Administration->Commands and enter the following in the Commands textbox:

        iptables -t mangle -I PREROUTING -i vlan1 -j TTL --ttl-set 128

4. Hit "Save Firewall" and you are ready to go!

This will set the TTL of all incoming packets to 128 ;-)
