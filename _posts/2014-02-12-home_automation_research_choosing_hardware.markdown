---
layout: post
title: "Home automation: research and choosing hardware"
comments: true
tags:
   - home automation
   - pinguino
   - olimex
   - hardware
   - internet of things
   - IoT
---

I decided to make a self made home automation system in my apartment. The reason is that I figured out that turning on and off my heating when I am not around reduces my electricity bill by 50%. My current schedule is to turn off the heating when I leave the house and turn it on 1 hour before I come back home. I do the same thing with the heating in my bedroom. The heating there is turned on about an hour before I go to sleep and I turn it off during the day. However there are exceptions from these rules especailly around holidays, so an automation system should also be very configurable.

So, I decided to automate the above actions with a home automation. My idea is to have a central node, which runs linux and an http server with a simple web app, which I can connect to from my phone/laptop. The web app will allow to send commands to the nodes controlling the heating at home. I will also allow to edit the schedule the heating uses to turn on/off. There will be an arbitrary amount of nodes in the apartment that accept different commands through a wireless protocol and control stuff like radiators, air conditioners, etc. Here is a diagram of the architecture:

![Home Automation Architecture]({{ site.url }}/images/home_automation_arch.png)

I explored the technologies out there and decided that I won't use WiFi for internal communication because this is too compex for embedded devices. It turns out there are much simpler and energy efficient protocols for wireless communication like [nRF24L01](http://www.nordicsemi.com/eng/Products/2.4GHz-RF/nRF24L01). This protocol allows to build cheap and power efficient edge nodes, that have the option to run on batteries for months.

Next I explored the different arduino-like development platforms and decided to go with [Olimex](https://www.olimex.com). Their prices are great and they also provide the UEXT modules, which is essentially breadboarding, but without the need to do any soldering and wiring. I am new to the hardware development, so for now I want to skip any wiring and soldering if possible. After putting all these requirements on the table it turned out that Olimex provide the cheapest solution out there, so I decided to go with them.

The hardware I decided to use is:

* [A10-OLinuXino-LIME](https://www.olimex.com/Products/OLinuXino/A10/A10-OLinuXino-LIME/open-source-hardware) - This is a board similar to raspberry pi, but is a little bit faster and has some goodness, like the posibility for a LiPo backup power, so it can continue to work even after a power outage. You can also attach a SATA hard drive and power it directly from the board. The board also has a UEXT slot, which will allow me to hook up a 2.4GHz RF module to talk to the edge nodes.
* [PIC32-PINGUINO-MX220](https://www.olimex.com/Products/Duino/PIC32/PIC32-PINGUINO-MX220/open-source-hardware) - This is a board similar to arduino, but is cheaper and has more memory. It has a connector to hook up to a LiPo battery and UEXT extension slot.
* [MOD-IRDA+](https://www.olimex.com/Products/Modules/Interface/MOD-IRDA+/open-source-hardware) - An infra red transcever running on a I2C bus. I2C is a nice bus, because it allows you to have several devices hooked up on the same bus
* [MOD-NRF24LR](https://www.olimex.com/Products/Modules/RF/MOD-NRF24LR/) - This is the 2.4GHz radio module for the wireless communication. It is ultra low power and works with over SPI interface, which is really simple to work with. Much simpler, cheaper and low power, than a full stack WiFi module
* [MOD-IO2](https://www.olimex.com/Products/Modules/IO/MOD-IO2/open-source-hardware) - This is a relay, which allows to control two power outlets. It also runs on the I2C interface.

I decided to use the UEXT sockets to hook up everything. Keep in mind that if you use UEXT you can hook up several I2C devices to the same port. You can also hook up several I2C devices and one SPI device, but you can't have several SPI devices. This is because SPI does not allow to use the same pins for several devices. I2C allows that, as it is a more comprex protocol with addressing and stuff.

I ordered the hardware and after 3 days I got everything on the mail:

![Olimex Delivery]({{ site.url }}/images/olimex_delivery.jpg)

In the next blog post I am going to write about setting up the development environment on Mac OS X 10.9 and running my first programs on these boards. Stay tuned!
