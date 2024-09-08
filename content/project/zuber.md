+++
title = "Zuber - Cab booking DMBS framework"
date = 2023-01-25
authors = ["hyouteki"]
description = "A cab booking application DBMS framework featuring OLAP queries, triggers, transactions, a comprehensive schema, over 50 queries, and a populated dummy database. It includes a CLI user interface for interacting with the database."
[taxonomies]
tags = ["sql", "python", "dbms", "systems", "dev"]
+++

A cab booking application DBMS framework featuring OLAP queries, triggers, transactions, a comprehensive schema, over 50 queries, and a populated dummy database. It includes a CLI user interface for interacting with the database.

## Quick Start
``` bash
git clone https://github.com/hyouteki/Zuber
```
``` bash
SOURCE /path/to/Zuber/repository/zuber-schema.sql
SOURCE /path/to/Zuber/repository/zuber-data.sql
SOURCE /path/to/Zuber/repository/zuber-queries.sql
SOURCE /path/to/Zuber/repository/zuber-triggers.sql
SOURCE /path/to/Zuber/repository/zuber-olap.sql
```
``` python
this.__databaseInstance = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mysql1234",
    database="zuber"
)
```
> Replace host, user & password [@](https://github.com/hyouteki/Zuber/blob/9c486aa4736450be07a5a4c03d16a84f3355e653/CLI/database.py#L10C1-L12C34) with your mysql credentials.
``` bash
cd Zuber/CLI
pip install termcolor tabulate
python zuber_client.py
python zuber_admin.py
```

## Contents
- [Requirement document](https://github.com/Hyouteki/Zuber/blob/main/requirement-document.md)
- [ER model & relational schema](https://miro.com/app/board/uXjVPr03MU0=/?share_link_id=806622025749)
- Database schema & population
  - [Database schema](https://github.com/Hyouteki/Zuber/blob/main/zuber-schema.sql)
  - [Database population/sample data](https://github.com/Hyouteki/Zuber/blob/main/zuber-data.sql)
- Queries & relational algebra
  - [Relational algebra](https://github.com/Hyouteki/Zuber/blob/main/relational-algebra.md)
  - [Sample queries](https://github.com/Hyouteki/Zuber/blob/main/zuber-queries.sql)
  - [Query explanation](https://github.com/Hyouteki/Zuber/blob/main/query-explaination.md)
- OLAP queries and triggers
  - [OLAP queries](https://github.com/Hyouteki/Zuber/blob/main/zuber-olap.sql)  
  - [Triggers](https://github.com/Hyouteki/Zuber/blob/main/zuber-triggers.sql)
- Transactions
  - [Transactions](https://github.com/Hyouteki/Zuber/blob/main/zuber-transactions.sql)
  - [Transaction explaination](https://github.com/Hyouteki/Zuber/blob/main/transaction-explaination.md)
- [Zuber CLI](https://github.com/Hyouteki/Zuber/tree/main/CLI)
- [User guide](https://github.com/Hyouteki/Zuber/blob/main/user-guide.md)

<br>
<a class="inline-button" href="https://github.com/hyouteki/Zuber" style="margin: 10px;">Repository</a>
<a class="inline-button" href="https://github.com/hyouteki/Zuber/blob/main/LICENSE" style="margin: 10px;">License MIT</a>