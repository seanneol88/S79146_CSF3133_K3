# S79146 · CSF3133 Web Design Lab Portfolio

A GitHub Pages site that collects every HTML exercise from **Lab 1** and **Lab 2**
of the CSF3133 Web Design course (Group K3).

[![Live site](https://img.shields.io/badge/live%20site-seanneol88.github.io-2f5bea?style=flat-square)](https://seanneol88.github.io/S79146_CSF3133_K3/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?style=flat-square&logo=githubpages&logoColor=white)](#)

---

## 🔗 Live site

**https://seanneol88.github.io/S79146_CSF3133_K3/**

> If that link shows a 404, GitHub Pages has not been switched on for this
> repository yet — see [Publishing](#-publishing-github-pages) below. It is a
> one-time, one-click setting.

---

## 📄 Pages

| Page | File | What it demonstrates |
| --- | --- | --- |
| **Home (site index)** | [`index.html`](index.html) | Landing page linking every exercise, with a validation screenshot gallery |
| About Me | [`Lab 1/lab1.html`](Lab%201/lab1.html) | Headings, `<strong>` / `<em>`, ordered & unordered lists, `<img>` |
| Kopi Pantai Café | [`Lab 1/lab1_ExerA.html`](Lab%201/lab1_ExerA.html) | Business page with a description list (`<dl>`) for the menu |
| Campus Coding Club | [`Lab 1/lab1_ExerB.html`](Lab%201/lab1_ExerB.html) | 13 markup errors found and fixed, plus a two-page navigation bar |
| Contact Us | [`Lab 1/contact.html`](Lab%201/contact.html) | Second page of the club site — committee list and contact details |
| Personal Profile | [`Lab2_only/lab2.html`](Lab2_only/lab2.html) | Semantic layout with a personal-info table and a contact form |
| FSKM Tech Day 2026 | [`Lab2_only/Lab2_ExerA.html`](Lab2_only/Lab2_ExerA.html) | `header` / `nav` / `section` / `article` and in-page anchor links |
| Course Feedback | [`Lab2_only/Lab2_ExerB.html`](Lab2_only/Lab2_ExerB.html) | 10 markup and accessibility errors fixed in a table + form page |
| Semantic HTML Example | [`Lab2_only/semantic.html`](Lab2_only/semantic.html) | Reference example of semantic elements vs. generic containers |
| Working with Tables | [`Lab2_only/table.html`](Lab2_only/table.html) | Basic tables plus `colspan` for merged header and summary cells |
| Creating Forms | [`Lab2_only/form.html`](Lab2_only/form.html) | Text inputs, radio buttons, checkboxes, select menu, submit button |

---

## 📁 Repository structure

```text
S79146_CSF3133_K3/
├── index.html                     ← GitHub Pages landing page
├── .nojekyll                      ← serve files as-is (no Jekyll processing)
├── .github/workflows/pages.yml    ← deploys the site on every push to main
├── Lab 1/
│   ├── lab1.html
│   ├── lab1_ExerA.html
│   ├── lab1_ExerB.html
│   ├── contact.html
│   ├── Validation_ExerA.png
│   ├── Validation_ExerB.png
│   └── lab1_ExerB_Error.png
└── Lab2_only/
    ├── lab2.html
    ├── Lab2_ExerA.html
    ├── Lab2_ExerB.html
    ├── semantic.html
    ├── table.html
    ├── form.html
    ├── Lab2_ExerA validation.png
    └── Lab2_ExerB validation.png
```

---

## 🚀 Publishing (GitHub Pages)

The site is deployed by the workflow in
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push to
`main`. GitHub requires the repository owner to enable Pages once:

1. Open **Settings → Pages**:
   <https://github.com/seanneol88/S79146_CSF3133_K3/settings/pages>
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Go to **Actions → Deploy to GitHub Pages → Run workflow**.

The site is then live at
<https://seanneol88.github.io/S79146_CSF3133_K3/> (first build takes about a minute).

<details>
<summary>Alternative: deploy straight from a branch (no Actions)</summary>

In **Settings → Pages**, set **Source** to *Deploy from a branch*, then pick
`main` and folder `/ (root)`, and save. Nothing else is required — but you can
then delete `.github/workflows/pages.yml` so the Actions workflow does not run.

</details>

---

## ✅ Validation evidence

All exercise pages were checked with the W3C Markup Validation Service; the
results are shown in the gallery on the home page and stored in the lab folders:

| Screenshot | Page checked |
| --- | --- |
| [`Lab 1/Validation_ExerA.png`](Lab%201/Validation_ExerA.png) | Lab 1 — Exercise A |
| [`Lab 1/Validation_ExerB.png`](Lab%201/Validation_ExerB.png) | Lab 1 — Exercise B |
| [`Lab 1/lab1_ExerB_Error.png`](Lab%201/lab1_ExerB_Error.png) | Lab 1 — errors in the original code |
| [`Lab2_only/Lab2_ExerA validation.png`](Lab2_only/Lab2_ExerA%20validation.png) | Lab 2 — Exercise A |
| [`Lab2_only/Lab2_ExerB validation.png`](Lab2_only/Lab2_ExerB%20validation.png) | Lab 2 — Exercise B |

---

## 🛠️ Run locally

No build step — the pages are plain HTML and CSS.

```bash
git clone https://github.com/seanneol88/S79146_CSF3133_K3.git
cd S79146_CSF3133_K3
python3 -m http.server 8000
# then open http://localhost:8000/
```

Opening `index.html` directly in a browser also works.

---

## 📝 Notes

- `Lab 1/lab1.html` loads its image from `via.placeholder.com`; if that host is
  unreachable the page shows the alt text instead.
- `Lab2_only/form.html` and `Lab2_only/lab2.html` post to `submit_form.php`,
  which is not part of this repository, so submitting the forms returns a 404.
  The form controls themselves render and behave normally.

---

**Course:** CSF3133 Web Design · **Group:** K3 · **Matric no.:** S79146 ·
**Repository:** <https://github.com/seanneol88/S79146_CSF3133_K3>
