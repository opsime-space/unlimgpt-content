# AGENTS.md

Инструкции для AI-агентов этого репозитория.

<!-- agent-platform:start -->

<!-- bd-doctor-divergence: ok -->

## Платформа агентов (Agent Platform)

Требования для Claude, Codex, Cursor и Gas City. Детали — в skills Packs и
`docs/guides/agent-workflow.md` репозитория `agent-platform`.

- Steering: промпт владельца сохраняется Beads-сообщением
  (`STEERING_ACK message=<id>`). Запишите его в owning Bead и закройте:
  `bd close <id> --reason 'applied: <bead>'`. Пока сообщения сессии открыты,
  ждут только close и handoff её работы. Облако без `bd`: steering не захвачен.
- Вход: `bd prime` → claim owning Bead → skill `gc.mayor` →
  `gc formula catalog` → `gc formula show` → ровно один `gc sling`.
- Методология — только skills Packs: brainstorming до проектирования,
  test-driven-development до кода, verification-before-completion до
  «готово», requesting-code-review до слияния.
- Безопасность: Указания владельца важнее skills. Без подтверждений — только
  на обратимых шагах; стоп на действиях владельца и разрушительных операциях;
  live-кластер — только infra-задачей с `cluster-scope: live`. Запрещены
  `route-work`, `agent-platform.native-routing`, `ordinary-admit`, второй
  task store, модели вне `fleet/providers.yaml` и `bd dolt start` в Rig.

<!-- agent-platform:end -->
