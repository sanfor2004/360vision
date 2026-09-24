# Proposal production

The reusable source for the SkyLimit proposal is in this directory. Recipient-specific output is intentionally generated under ignored `temp/proposals/skylimit/`, away from the public marketing pack and Git history.

Generate the deliverables on Windows with Chrome installed:

```text
python -m pip install python-docx --target temp/proposal-tools
node scripts/proposals/render-assets.cjs
python scripts/proposals/build-docx.py
python scripts/proposals/docx-to-html.py
node scripts/proposals/render-pdf.cjs
```

The DOCX remains editable. The printable HTML is derived from the DOCX's content, then Chromium renders the PDF; both should be checked visually after edits because Word and Chromium can paginate differently. The renderer checks for hidden page overflow and writes review images for each personalized PDF page.

`render-assets.cjs` reuses the real Cedar House viewer capture and the existing portrait product film. The lifestyle background is illustrative. The short film's final card is recipient-specific. The personalized proposal treats public hosting, inquiry capture, and SkyLimit integration as proposed funded work, while its current-product screenshots come from the local application.

For a different buyer, adapt the generic DOCX or edit the shared content in `build-docx.py`, change the cover copy in `render-assets.cjs`, and regenerate. Verify all recipient details and market-source links before sending. No generated output is automatically published or sent.
