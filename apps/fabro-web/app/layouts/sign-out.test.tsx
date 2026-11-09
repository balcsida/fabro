import { afterEach, describe, expect, test } from "bun:test";

import { signOut } from "./sidebar";

describe("signOut", () => {
  const original = globalThis.document;
  afterEach(() => {
    globalThis.document = original;
  });

  test("posts /auth/logout from a form attached to the document", () => {
    const attached: unknown[] = [];
    const form = {
      method: "",
      action: "",
      submitted: false,
      submit() {
        this.submitted = attached.includes(this);
      },
    };
    globalThis.document = {
      createElement: (tag: string) => {
        expect(tag).toBe("form");
        return form;
      },
      body: { append: (el: unknown) => attached.push(el) },
    } as unknown as Document;

    signOut();

    expect(form.method).toBe("POST");
    expect(form.action).toBe("/auth/logout");
    expect(form.submitted).toBe(true);
  });
});
