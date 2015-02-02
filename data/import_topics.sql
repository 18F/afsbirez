drop schema if exists import cascade;
create schema import;
set search_path=import;
\i topics.sql
\i transfer_schemas.sql
\i fulltext.sql