import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_TICKET_TEMPLATES,
  findTicketTemplate,
  parseTicketTemplatesFromJson,
  resolveTicketTemplates,
  ticketTemplatesFromTeamSettings,
} from "./templates";

describe("data/templates", () => {
  it("resolves defaults and finds by id", () => {
    assert.equal(resolveTicketTemplates(undefined).length, 2);
    const custom = resolveTicketTemplates([
      {
        id: "c1",
        name: "One",
        type: "task",
        title: "T",
        body: "",
        priority: "minor",
      },
    ]);
    assert.equal(custom.length, 1);
    const bug = findTicketTemplate("tpl_bug", DEFAULT_TICKET_TEMPLATES);
    assert.equal(bug?.name, "Bug report");
    assert.equal(findTicketTemplate("nope", DEFAULT_TICKET_TEMPLATES), undefined);
  });

  it("reads templates from team settings JSON", () => {
    const fromTeam = ticketTemplatesFromTeamSettings(
      JSON.stringify({
        ticketTemplates: [
          {
            id: "c1",
            name: "Spike",
            type: "task",
            title: "Spike: ",
            body: "",
            priority: "minor",
          },
        ],
      }),
    );
    assert.equal(fromTeam[0].name, "Spike");
    assert.equal(ticketTemplatesFromTeamSettings("{").length, 2);
  });

  it("parses custom templates from JSON", () => {
    const parsed = parseTicketTemplatesFromJson([
      {
        id: "custom",
        name: "Spike",
        type: "task",
        title: "Spike: ",
        body: "",
        priority: "minor",
      },
    ]);
    assert.ok(parsed);
    assert.equal(parsed![0].id, "custom");
    assert.equal(parseTicketTemplatesFromJson([{ id: "" }]), null);
    assert.equal(parseTicketTemplatesFromJson(null), null);
    assert.equal(
      parseTicketTemplatesFromJson([
        {
          id: "bad",
          name: "X",
          type: "select",
          title: "",
          body: "",
          priority: "minor",
        },
      ]),
      null,
    );
    assert.equal(
      parseTicketTemplatesFromJson([
        {
          id: "bad2",
          name: "Y",
          type: "task",
          title: "",
          body: "",
          priority: "not-a-priority",
        },
      ]),
      null,
    );
    assert.equal(parseTicketTemplatesFromJson([]), null);
    assert.equal(parseTicketTemplatesFromJson([null]), null);
    assert.equal(
      parseTicketTemplatesFromJson([
        {
          id: "x",
          type: "task",
          title: "",
          body: "",
          priority: "minor",
        },
      ]),
      null,
    );
    assert.equal(
      parseTicketTemplatesFromJson([
        {
          id: "only-id",
          name: undefined,
          type: "task",
          title: "T",
          body: "",
          priority: "minor",
        },
      ]),
      null,
    );
    assert.equal(
      parseTicketTemplatesFromJson([
        {
          id: "x",
          name: "",
          type: "task",
          title: "",
          body: "",
          priority: "minor",
        },
      ]),
      null,
    );
    assert.equal(
      ticketTemplatesFromTeamSettings(
        JSON.stringify({ ticketTemplates: null }),
      ).length,
      2,
    );
    assert.equal(
      ticketTemplatesFromTeamSettings(
        JSON.stringify({
          ticketTemplates: [
            {
              id: "c1",
              name: "One",
              type: "task",
              title: "",
              body: "",
              priority: "minor",
            },
          ],
        }),
      )[0].id,
      "c1",
    );
  });
});
