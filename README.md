# UnlimGPT Content

Публичный редакционный контент UnlimGPT на русском и английском языках:
документация разработчика, лендинг, FAQ, представление тарифов и юридические страницы.

Код приложения и канонические runtime-модели, ставки, доступность, права доступа,
балансы и аккаунты остаются в продукте UnlimGPT и PostgreSQL/GraphQL.

Редакторские изменения идут через PR в `main`, с проверкой обеих локалей и
независимым review. `docs-staging` предназначена для редакторских черновиков;
production Studio включается отдельно после настройки OAuth и moderators.

Web получает **полный SHA коммита** этого репозитория из `deploy/content.revision`
продукта. Штатный release candidate проверяет exact checkout, передаёт его как
BuildKit named context и записывает SHA в подписанное provenance. Сам merge
контента не переключает production: требуется обычный просмотренный web release.

`content/` содержит файлы Nuxt Content. `schemas/` — генерируемые JSON Schema
из единого typed-контракта `apps/web/content.schema.ts` продукта; вручную их не
редактируют. Страницы с `generated: true` обновляют генератором продукта через
`UNLIMGPT_CONTENT_ROOT=<checkout>/content bun run docs:developer:generate`.

Локальная проверка: Bun `1.4.2`, `bun install --frozen-lockfile`, `bun run verify`.

Юридические страницы помечены как проект до отдельного утверждения реквизитов,
процедур и даты вступления в силу. Публикация проекта не делает его действующим
договором и не подтверждает выполнение процедур защиты данных.
