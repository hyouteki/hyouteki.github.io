+++
title = "Please Hire Me - LeetCode Ques. Tracker"
date = 2023-12-01
authors = ["hyouteki"]
description = "LeetCode users (volunteers) have to mandatorily solve a specified number of questions each week. Furthermore, if they fail to do so, the repository will mark them Dead on the sheet and will not track their progress any further."
[taxonomies]
tags = ["python", "github-actions", "automation", "sheets", "api"]
[extra] 
archive = "This project is archived on Apr 5, 2024 due to LeetCode introducing firewall."
+++

This [repository](https://github.com/hyouteki/please-hire-me) manages a  [google spreadsheet](https://docs.google.com/spreadsheets/d/1NcB1bmKRg-j56KUsd7WNHYpkVBx0S7Jkr26LyeJW8HQ) in which LeetCode users (volunteers) have to mandatorily solve a specified number of questions each week. Furthermore, if they fail to do so, the repository will mark them Dead on the sheet and will not track their progress any further.

## How does this work?
There are two workflows (update and reset). The update workflow scrappes the latest 15 questions done by each alive user every 15 minutes. If any questions match the questions allocated this week, the workflow will mark it as Done. The reset workflow triggers once a week _(Tuesday 00:00 AM (GMT) or 05:30 AM (IST))_, and for any user if not found Done for questions allocated this week, the workflow will mark them as Dead and not track their progress any further.

## Quick Start
> **Note**: Volunteers do not have to set up. Just solve questions mentioned in the [spreadsheet](https://docs.google.com/spreadsheets/d/1NcB1bmKRg-j56KUsd7WNHYpkVBx0S7Jkr26LyeJW8HQ).
1. Fork the [repository](https://github.com/hyouteki/please-hire-me).
2. Import this [csv template](sheets-template.csv) into your spreadsheet.
3. Replace sample usernames with actual LeetCode user names.
4. Get spreadsheet id from the sheets url. For example, spreadsheet id for this [url](https://docs.google.com/spreadsheets/d/1NcB1bmKRg-j56KUsd7WNHYpkVBx0S7Jkr26LyeJW8HQ/) would be `1NcB1bmKRg-j56KUsd7WNHYpkVBx0S7Jkr26LyeJW8HQ`.
5. Replace the `SPREADSHEET_ID` [@](https://github.com/hyouteki/please-hire-me/blob/579b9b677db0fcb30f5642de9720016099540c8f/src/spreadsheet_editor.py#L10) with yours.
6. Follow [this](https://developers.google.com/sheets/api/quickstart/python) blog or watch [this](https://www.youtube.com/watch?v=3wC-SCdJK2c) video on how to setup google speadsheet api in your google cloud project.
7. Then set up a repository secret using [this](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository), having following credentials.
   ``` cpp
   Name: "TOKEN_JSON"
   Secret: <token.json-file> // made during the previous step
   ```

<br> 
<a class="inline-button" href="https://github.com/hyouteki/please-hire-me" style="margin: 10px;">Repository</a> 
<a class="inline-button" href="https://github.com/hyouteki/please-hire-me/blob/main/LICENSE.md" style="margin: 10px;">License MIT</a> 
