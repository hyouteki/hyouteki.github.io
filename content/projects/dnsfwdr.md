+++
title = "dnsfwdr - DNS Forwarder"
date = 2024-05-12
authors = ["hyouteki"]
description = "A basic DNS forwarder server in C with capabilities including request caching, request blocking, forwarding requests, and fallback to different authoritative servers when necessary."
[taxonomies]
tags = ["c", "dns", "dns-forwarder", "systems"]
+++

A basic DNS forwarder server in C with capabilities including request caching, request blocking, forwarding requests, and fallback to different authoritative servers when necessary.

![Server](https://github.com/hyouteki/dnsfwdr/blob/main/images/server.png?raw=true)
<figcaption>DNS Forwarding Server</figcaption>

![Client](https://github.com/hyouteki/dnsfwdr/blob/main/images/client.png?raw=true)
<figcaption>The client requests the DNS forwarding server (running at localhost:8989) to resolve the address of the domain name "www.google.com"</figcaption>

## Quick Start
1. Clone the repository via `git clone https://github.com/hyouteki/dnsfwdr`
2. Build the project using `make`
3. Run the DNS forwarding server using `./server`
4. Test the server using a dummy client via make `client`


## References
- [Coding Challenges - Build Your Own DNS Forwarder](https://codingchallenges.fyi/challenges/challenge-dns-forwarder)
- [RFC 1035 Section 4.1.1 - DNS query format](https://datatracker.ietf.org/doc/html/rfc1035#section-4.1)
- [Hash functions - sdbm](http://www.cse.yorku.ca/~oz/hash.html)

<br> 
<a class="inline-button" href="https://github.com/hyouteki/dnsfwdr" style="margin: 10px;">Repository</a> 
<a class="inline-button" href="https://github.com/hyouteki/dnsfwdr/blob/main/LICENSE" style="margin: 10px;">License GPL-3.0</a> 
