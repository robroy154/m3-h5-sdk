# Benco

M3 customizations and integrations for the Benco client.

Anything here is customer-specific by definition. If a script would be useful
at more than one tenant, it belongs in
[`Projects/General/`](../General/H5-Scripts/) with its tenant-specific values
exposed as script arguments.

---

## Folder structure

```text
Benco/
├── H5-Scripts/     # In-panel H5 Script SDK customizations
│   └── archive/    # Superseded versions, kept for rollback reference
└── APIs/           # API reference material
```

---

## H5-Scripts

See [`H5-Scripts/README.md`](H5-Scripts/README.md) for file status, the
TypeScript workflow, and deployment notes.

`POReceiptShortcutV4` is the live PO receipt script and is frozen. New work on
that flow goes to
[`Projects/General/H5-Scripts/POReceiptShortcut/`](../General/H5-Scripts/POReceiptShortcut/).
