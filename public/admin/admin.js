/* ===================================================================
   Bridgeway Developers — Admin dashboard logic
   - loads draft, renders a separate editor per section
   - auto-saves the draft, then "Publish to Site" promotes it live
   =================================================================== */
(function () {
  'use strict';

  var state = { content: null, pendingChanges: false, lastPublished: null };
  var panel = document.getElementById('panel');
  var publishBtn = document.getElementById('publishBtn');
  var discardBtn = document.getElementById('discardBtn');
  var statusPill = document.getElementById('statusPill');
  var pendingNote = document.getElementById('pendingNote');
  var tabTitle = document.getElementById('tabTitle');
  var toastEl = document.getElementById('toast');
  var currentTab = 'hero';

  var TAB_LABELS = {
    hero: 'Hero', about: 'About & Stats', projects: 'Projects', services: 'Services',
    whyUs: 'Why Us', process: 'Process', testimonials: 'Testimonials', contact: 'Contact',
    footer: 'Footer', site: 'Site & SEO', media: 'Media Library', settings: 'Settings'
  };

  /* ---------------- helpers ---------------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function toast(msg, kind) {
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + (kind || '');
    toastEl.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.className = 'toast'; }, 2600);
  }
  function api(method, url, body, isForm) {
    var opts = { method: method, headers: {} };
    if (body && !isForm) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    if (body && isForm) opts.body = body;
    return fetch(url, opts).then(function (r) {
      if (r.status === 401) { location.href = '/admin/login'; throw new Error('auth'); }
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || 'Request failed');
        return j;
      });
    });
  }

  /* ---------------- save / publish ---------------- */
  var saveTimer = null;
  function markDirty() {
    statusPill.textContent = 'Unsaved…';
    statusPill.className = 'status-pill dirty';
  }
  function scheduleSave(key) {
    markDirty();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { saveSection(key); }, 600);
  }
  function saveSection(key) {
    statusPill.textContent = 'Saving…';
    statusPill.className = 'status-pill saving';
    return api('PUT', '/api/admin/section/' + key, state.content[key]).then(function (res) {
      state.pendingChanges = res.pendingChanges;
      statusPill.textContent = 'Saved';
      statusPill.className = 'status-pill';
      refreshPublishState();
    }).catch(function (e) { toast(e.message, 'err'); });
  }
  function refreshPublishState() {
    if (state.pendingChanges) {
      publishBtn.disabled = false;
      publishBtn.classList.add('has-changes');
      pendingNote.textContent = '● Unpublished changes';
    } else {
      publishBtn.disabled = true;
      publishBtn.classList.remove('has-changes');
      pendingNote.textContent = state.lastPublished
        ? 'Published ' + timeAgo(state.lastPublished)
        : 'Nothing published yet';
    }
  }
  function timeAgo(iso) {
    var s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + ' min ago';
    if (s < 86400) return Math.floor(s / 3600) + ' hr ago';
    return new Date(iso).toLocaleDateString();
  }

  publishBtn.addEventListener('click', function () {
    if (publishBtn.disabled) return;
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing…';
    api('POST', '/api/admin/publish').then(function (res) {
      state.pendingChanges = false;
      state.lastPublished = res.lastPublished;
      publishBtn.innerHTML = '<span class="dot"></span> Publish to Site';
      refreshPublishState();
      toast('🚀 Published to your live site!', 'ok');
    }).catch(function (e) {
      publishBtn.innerHTML = '<span class="dot"></span> Publish to Site';
      publishBtn.disabled = false;
      toast(e.message, 'err');
    });
  });

  discardBtn.addEventListener('click', function () {
    if (!confirm('Discard all unpublished changes and revert to the live site content?')) return;
    api('POST', '/api/admin/discard').then(function (res) {
      state.content = res.content;
      state.pendingChanges = false;
      refreshPublishState();
      render(currentTab);
      toast('Changes discarded', 'ok');
    }).catch(function (e) { toast(e.message, 'err'); });
  });

  /* ---------------- media upload + picker ---------------- */
  function uploadFile(file) {
    var fd = new FormData();
    fd.append('file', file);
    return api('POST', '/api/admin/upload', fd, true);
  }
  // A reusable image/video picker bound to obj[prop]
  function mediaField(label, obj, prop, opts) {
    opts = opts || {};
    var thumb = el('div', { class: 'media-thumb' });
    function paint() {
      thumb.innerHTML = '';
      var v = obj[prop];
      if (v) {
        var isVid = /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(v);
        thumb.appendChild(el(isVid ? 'video' : 'img', { src: v, muted: isVid ? '' : null }));
      }
    }
    var urlInput = el('input', {
      type: 'text', value: obj[prop] || '', placeholder: 'Image/video URL or upload →',
      oninput: function () { obj[prop] = urlInput.value; paint(); if (opts.onChange) opts.onChange(); }
    });
    var fileInput = el('input', {
      type: 'file', accept: opts.accept || 'image/*,video/*',
      onchange: function () {
        if (!fileInput.files[0]) return;
        toast('Uploading…');
        uploadFile(fileInput.files[0]).then(function (res) {
          obj[prop] = res.url; urlInput.value = res.url; paint();
          if (opts.onChange) opts.onChange();
          toast('Uploaded', 'ok');
        }).catch(function (e) { toast(e.message, 'err'); });
      }
    });
    paint();
    return el('div', { class: 'fld' }, [
      label ? el('label', {}, [label]) : null,
      el('div', { class: 'media-field' }, [
        thumb,
        el('div', { class: 'media-controls' }, [
          urlInput,
          el('label', { class: 'upload-btn' }, ['⬆ Upload file', fileInput])
        ])
      ])
    ]);
  }

  /* ---------------- generic field builders ---------------- */
  function textField(label, obj, prop, opts) {
    opts = opts || {};
    var input = el(opts.area ? 'textarea' : 'input', {
      type: 'text', value: obj[prop] != null ? obj[prop] : '', placeholder: opts.placeholder || '',
      rows: opts.rows || 3,
      oninput: function () {
        obj[prop] = opts.number ? (parseInt(input.value, 10) || 0) : input.value;
        scheduleSave(opts.section || currentTab);
      }
    });
    if (opts.number) input.type = 'number';
    return el('div', { class: 'fld' }, [
      el('label', {}, [label]),
      input,
      opts.sub ? el('div', { class: 'sub' }, [opts.sub]) : null
    ]);
  }

  /* ---------------- section renderers ---------------- */
  var R = {};

  R.hero = function (c) {
    var h = c.hero;
    return [card('Hero Section', 'The first thing visitors see — headline text and background video.', [
      textField('Eyebrow (small label)', h, 'eyebrow'),
      textField('Main Title', h, 'title'),
      textField('Tagline', h, 'tagline'),
      mediaField('Background Video', h, 'video', { accept: 'video/*', onChange: function () { scheduleSave('hero'); } }),
      mediaField('Poster Image (shown while video loads)', h, 'poster', { accept: 'image/*', onChange: function () { scheduleSave('hero'); } })
    ])];
  };

  R.about = function (c) {
    var a = c.about;
    var paras = el('div');
    function paintParas() {
      paras.innerHTML = '';
      a.leadParagraphs.forEach(function (_, i) {
        var ta = el('textarea', {
          rows: 3, value: a.leadParagraphs[i],
          oninput: function () { a.leadParagraphs[i] = ta.value; scheduleSave('about'); }
        });
        paras.appendChild(el('div', { class: 'item-card' }, [
          el('div', { class: 'item-head' }, [
            el('strong', {}, ['Paragraph ' + (i + 1)]),
            el('div', { class: 'item-actions' }, [
              el('button', { class: 'mini-btn danger', onclick: function () { a.leadParagraphs.splice(i, 1); paintParas(); scheduleSave('about'); } }, ['Remove'])
            ])
          ]),
          ta
        ]));
      });
    }
    paintParas();

    var stats = el('div');
    function paintStats() {
      stats.innerHTML = '';
      a.stats.forEach(function (s, i) {
        stats.appendChild(el('div', { class: 'item-card' }, [
          el('div', { class: 'item-head' }, [
            el('strong', {}, ['Stat ' + (i + 1)]),
            el('button', { class: 'mini-btn danger', onclick: function () { a.stats.splice(i, 1); paintStats(); scheduleSave('about'); } }, ['Remove'])
          ]),
          el('div', { class: 'field-row' }, [
            numInline('Number', s, 'target'), textInline('Suffix', s, 'suffix')
          ]),
          textInline('Label', s, 'label')
        ]));
      });
    }
    function numInline(label, o, p) {
      var inp = el('input', { type: 'number', value: o[p], oninput: function () { o[p] = parseInt(inp.value, 10) || 0; scheduleSave('about'); } });
      return el('div', { class: 'fld' }, [el('label', {}, [label]), inp]);
    }
    function textInline(label, o, p) {
      var inp = el('input', { type: 'text', value: o[p], oninput: function () { o[p] = inp.value; scheduleSave('about'); } });
      return el('div', { class: 'fld' }, [el('label', {}, [label]), inp]);
    }
    paintStats();

    return [
      card('About — Intro Paragraphs', 'The introduction text under the hero.', [
        paras,
        addButton('Add paragraph', function () { a.leadParagraphs.push(''); paintParas(); scheduleSave('about'); })
      ]),
      card('Stat Counters', 'The animated numbers (e.g. "45+ Projects Planned").', [
        stats,
        addButton('Add stat', function () { a.stats.push({ target: 0, suffix: '+', label: 'New stat' }); paintStats(); scheduleSave('about'); })
      ])
    ];
  };

  R.projects = function (c) {
    var pr = c.projects;
    var wrap = el('div');
    function paint() {
      wrap.innerHTML = '';
      pr.items.forEach(function (p, i) {
        wrap.appendChild(projectCard(p, i, paint, pr));
      });
    }
    paint();
    return [
      card('Projects — Heading', 'Section label and title above the projects carousel.', [
        textField('Section Label', pr, 'label', { section: 'projects' }),
        textField('Section Heading', pr, 'heading', { section: 'projects' })
      ]),
      card('Projects', 'Add, edit or remove projects. Each can have a cover image, an optional video, and a photo gallery.', [
        wrap,
        addButton('+ Add new project', function () {
          pr.items.push({ id: 'p' + Date.now().toString(36), title: 'New Project', type: 'Apartments · Location', status: 'Planning', description: '', image: '', video: '', gallery: [] });
          paint(); scheduleSave('projects');
        })
      ])
    ];
  };

  function projectCard(p, i, repaint, pr) {
    if (!p.gallery) p.gallery = [];
    var gal = el('div', { class: 'gallery-grid' });
    function paintGal() {
      gal.innerHTML = '';
      p.gallery.forEach(function (url, gi) {
        var isVid = /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(url);
        gal.appendChild(el('div', { class: 'gallery-item' }, [
          el(isVid ? 'video' : 'img', { src: url, muted: isVid ? '' : null }),
          el('button', { class: 'rm', title: 'Remove', onclick: function () { p.gallery.splice(gi, 1); paintGal(); scheduleSave('projects'); } }, ['×'])
        ]));
      });
    }
    paintGal();
    var galUpload = el('input', {
      type: 'file', accept: 'image/*,video/*', multiple: '',
      onchange: function () {
        var files = Array.prototype.slice.call(galUpload.files);
        if (!files.length) return;
        toast('Uploading ' + files.length + ' file(s)…');
        Promise.all(files.map(uploadFile)).then(function (res) {
          res.forEach(function (r) { p.gallery.push(r.url); });
          paintGal(); scheduleSave('projects'); toast('Added to gallery', 'ok');
        }).catch(function (e) { toast(e.message, 'err'); });
      }
    });

    function f(label, prop, area) {
      var node = el(area ? 'textarea' : 'input', {
        type: 'text', rows: 2, value: p[prop] || '',
        oninput: function () { p[prop] = node.value; scheduleSave('projects'); }
      });
      return el('div', { class: 'fld' }, [el('label', {}, [label]), node]);
    }
    function statusSelect() {
      var opts = ['Planning', 'Now Selling', 'Under Construction', 'Completed', 'Sold Out'];
      var sel = el('select', { onchange: function () { p.status = sel.value; scheduleSave('projects'); } });
      opts.forEach(function (o) {
        var op = el('option', { value: o }, [o]); if (p.status === o) op.selected = true; sel.appendChild(op);
      });
      if (opts.indexOf(p.status) === -1 && p.status) { var ex = el('option', { value: p.status }, [p.status]); ex.selected = true; sel.appendChild(ex); }
      return el('div', { class: 'fld' }, [el('label', {}, ['Status Badge']), sel]);
    }

    // --- Project page: specs (label/value) ---
    if (!p.details) p.details = [];
    var detailsWrap = el('div');
    function paintDetails() {
      detailsWrap.innerHTML = '';
      p.details.forEach(function (d, di) {
        var lab = el('input', { type: 'text', value: d.label || '', placeholder: 'Label (e.g. Floors)', oninput: function () { d.label = lab.value; scheduleSave('projects'); } });
        var val = el('input', { type: 'text', value: d.value || '', placeholder: 'Value (e.g. 14)', oninput: function () { d.value = val.value; scheduleSave('projects'); } });
        detailsWrap.appendChild(el('div', { class: 'field-row', style: 'margin-bottom:8px;align-items:center' }, [
          el('div', { class: 'fld', style: 'margin:0' }, [lab]),
          el('div', { class: 'fld', style: 'margin:0;display:flex;gap:6px' }, [val,
            el('button', { class: 'mini-btn danger', onclick: function () { p.details.splice(di, 1); paintDetails(); scheduleSave('projects'); } }, ['×'])])
        ]));
      });
    }
    paintDetails();

    // --- Project page: key features ---
    if (!p.features) p.features = [];
    var featWrap = el('div');
    function paintFeats() {
      featWrap.innerHTML = '';
      p.features.forEach(function (ft, fi) {
        var inp = el('input', { type: 'text', value: ft, placeholder: 'Feature / amenity', oninput: function () { p.features[fi] = inp.value; scheduleSave('projects'); } });
        featWrap.appendChild(el('div', { class: 'fld', style: 'margin-bottom:6px;display:flex;gap:6px' }, [inp,
          el('button', { class: 'mini-btn danger', onclick: function () { p.features.splice(fi, 1); paintFeats(); scheduleSave('projects'); } }, ['×'])]));
      });
    }
    paintFeats();

    return el('div', { class: 'item-card' }, [
      el('div', { class: 'item-head' }, [
        el('strong', {}, ['📦 ' + (p.title || 'Untitled')]),
        el('div', { class: 'item-actions' }, [
          el('a', { class: 'mini-btn', href: '/projects/' + p.id, target: '_blank', title: 'Open the project page' }, ['↗ Page']),
          i > 0 ? el('button', { class: 'mini-btn', title: 'Move up', onclick: function () { swap(pr.items, i, i - 1); repaint(); scheduleSave('projects'); } }, ['↑']) : null,
          i < pr.items.length - 1 ? el('button', { class: 'mini-btn', title: 'Move down', onclick: function () { swap(pr.items, i, i + 1); repaint(); scheduleSave('projects'); } }, ['↓']) : null,
          el('button', { class: 'mini-btn danger', onclick: function () { if (confirm('Delete this project?')) { pr.items.splice(i, 1); repaint(); scheduleSave('projects'); } } }, ['Delete'])
        ])
      ]),
      el('div', { class: 'field-row' }, [f('Title', 'title'), f('Type / Location', 'type')]),
      statusSelect(),
      f('Short Description (shown on the card)', 'description', true),
      f('Detailed Description — for the project page (one paragraph per line)', 'longDescription', true),
      el('div', { class: 'fld' }, [
        el('label', {}, ['Project Details / Specs']),
        detailsWrap,
        el('button', { class: 'mini-btn', onclick: function () { p.details.push({ label: '', value: '' }); paintDetails(); scheduleSave('projects'); } }, ['+ Add detail'])
      ]),
      el('div', { class: 'fld' }, [
        el('label', {}, ['Key Features']),
        featWrap,
        el('button', { class: 'mini-btn', onclick: function () { p.features.push(''); paintFeats(); scheduleSave('projects'); } }, ['+ Add feature'])
      ]),
      mediaField('Cover Image', p, 'image', { accept: 'image/*', onChange: function () { scheduleSave('projects'); } }),
      mediaField('Cover Video (optional — replaces image in carousel & hero)', p, 'video', { accept: 'video/*', onChange: function () { scheduleSave('projects'); } }),
      el('div', { class: 'fld' }, [
        el('label', {}, ['Photo / Video Gallery (shown on the project page)']),
        gal,
        el('label', { class: 'upload-btn', style: 'margin-top:8px;display:inline-block' }, ['⬆ Add gallery media', galUpload])
      ])
    ]);
  }
  function swap(arr, a, b) { var t = arr[a]; arr[a] = arr[b]; arr[b] = t; }

  // generic list section (services, whyUs, process, testimonials)
  function listSection(key, cfg) {
    return function (c) {
      var sec = c[key];
      var wrap = el('div');
      function paint() {
        wrap.innerHTML = '';
        sec.items.forEach(function (item, i) {
          var fields = cfg.fields.map(function (fd) {
            var node = el(fd.area ? 'textarea' : 'input', {
              type: 'text', rows: 2, value: item[fd.prop] != null ? item[fd.prop] : '',
              oninput: function () { item[fd.prop] = node.value; scheduleSave(key); }
            });
            return el('div', { class: 'fld' }, [el('label', {}, [fd.label]), node]);
          });
          wrap.appendChild(el('div', { class: 'item-card' }, [
            el('div', { class: 'item-head' }, [
              el('strong', {}, [cfg.title + ' ' + (i + 1)]),
              el('div', { class: 'item-actions' }, [
                i > 0 ? el('button', { class: 'mini-btn', onclick: function () { swap(sec.items, i, i - 1); paint(); scheduleSave(key); } }, ['↑']) : null,
                i < sec.items.length - 1 ? el('button', { class: 'mini-btn', onclick: function () { swap(sec.items, i, i + 1); paint(); scheduleSave(key); } }, ['↓']) : null,
                el('button', { class: 'mini-btn danger', onclick: function () { sec.items.splice(i, 1); paint(); scheduleSave(key); } }, ['Delete'])
              ])
            ])
          ].concat(fields)));
        });
      }
      paint();
      return [
        card(cfg.heading + ' — Heading', 'Section label and title.', [
          textField('Section Label', sec, 'label', { section: key }),
          textField('Section Heading', sec, 'heading', { section: key })
        ]),
        card(cfg.heading, cfg.hint, [
          wrap,
          addButton('+ Add ' + cfg.title.toLowerCase(), function () { sec.items.push(cfg.blank()); paint(); scheduleSave(key); })
        ])
      ];
    };
  }

  R.services = listSection('services', {
    title: 'Service', heading: 'Services', hint: 'The expertise cards.',
    fields: [{ label: 'Number', prop: 'no' }, { label: 'Title', prop: 'title' }, { label: 'Description', prop: 'description', area: true }],
    blank: function () { return { no: '0', title: 'New Service', description: '' }; }
  });
  R.whyUs = listSection('whyUs', {
    title: 'Reason', heading: 'Why Us', hint: 'The reasons investors trust you.',
    fields: [{ label: 'Title', prop: 'title' }, { label: 'Description', prop: 'description', area: true }],
    blank: function () { return { title: 'New Reason', description: '' }; }
  });
  R.process = listSection('process', {
    title: 'Step', heading: 'Process', hint: 'The step-by-step process.',
    fields: [{ label: 'Number', prop: 'num' }, { label: 'Title', prop: 'title' }, { label: 'Description', prop: 'description', area: true }],
    blank: function () { return { num: '0', title: 'New Step', description: '' }; }
  });
  R.testimonials = listSection('testimonials', {
    title: 'Testimonial', heading: 'Testimonials', hint: 'Client quotes.',
    fields: [{ label: 'Quote', prop: 'quote', area: true }, { label: 'Name', prop: 'name' }, { label: 'Role / Detail', prop: 'role' }],
    blank: function () { return { quote: '', name: 'New Client', role: '' }; }
  });

  R.contact = function (c) {
    var ct = c.contact;
    return [card('Contact Section', 'Your contact details and map.', [
      textField('Section Label', ct, 'label'),
      textField('Heading (HTML allowed, use <br /> for line break)', ct, 'heading'),
      textField('Intro Text', ct, 'intro', { area: true }),
      el('div', { class: 'field-row' }, [
        wrapField('Phone', ct, 'phone'),
        wrapField('Email', ct, 'email')
      ]),
      textField('Address', ct, 'address'),
      textField('Map Embed URL', ct, 'mapEmbed', { sub: 'OpenStreetMap/Google Maps embed src URL.' })
    ])];
    function wrapField(label, o, p) {
      var inp = el('input', { type: 'text', value: o[p] || '', oninput: function () { o[p] = inp.value; scheduleSave('contact'); } });
      return el('div', { class: 'fld' }, [el('label', {}, [label]), inp]);
    }
  };

  R.footer = function (c) {
    var ft = c.footer;
    var socials = el('div');
    function paint() {
      socials.innerHTML = '';
      ft.socials.forEach(function (s, i) {
        socials.appendChild(el('div', { class: 'item-card' }, [
          el('div', { class: 'item-head' }, [
            el('strong', {}, ['Link ' + (i + 1)]),
            el('button', { class: 'mini-btn danger', onclick: function () { ft.socials.splice(i, 1); paint(); scheduleSave('footer'); } }, ['Remove'])
          ]),
          el('div', { class: 'field-row' }, [
            inlineF('Label', s, 'label'), inlineF('URL', s, 'url')
          ])
        ]));
      });
    }
    function inlineF(label, o, p) {
      var inp = el('input', { type: 'text', value: o[p] || '', oninput: function () { o[p] = inp.value; scheduleSave('footer'); } });
      return el('div', { class: 'fld' }, [el('label', {}, [label]), inp]);
    }
    paint();
    return [
      card('Footer', 'Footer brand text and description.', [
        textField('Brand Text', ft, 'brandText'),
        textField('Description', ft, 'description', { area: true })
      ]),
      card('Social Links', 'Footer social links.', [
        socials,
        addButton('Add link', function () { ft.socials.push({ label: 'New', url: '#' }); paint(); scheduleSave('footer'); })
      ])
    ];
  };

  R.site = function (c) {
    var s = c.site;
    return [card('Site & SEO', 'Global settings used for the browser tab and search engines.', [
      textField('Brand Name', s, 'brandName'),
      textField('Page Title (browser tab)', s, 'title'),
      textField('Meta Description', s, 'metaDescription', { area: true }),
      textField('Meta Keywords', s, 'metaKeywords', { area: true }),
      textField('Theme Color (hex)', s, 'themeColor')
    ])];
  };

  R.media = function () {
    var grid = el('div', { class: 'media-lib' }, [el('p', { class: 'hint' }, ['Loading…'])]);
    var dropUpload = el('input', {
      type: 'file', accept: 'image/*,video/*', multiple: '',
      onchange: function () {
        var files = Array.prototype.slice.call(dropUpload.files);
        if (!files.length) return;
        toast('Uploading…');
        Promise.all(files.map(uploadFile)).then(function () { load(); toast('Uploaded', 'ok'); }).catch(function (e) { toast(e.message, 'err'); });
      }
    });
    function load() {
      api('GET', '/api/admin/media').then(function (files) {
        grid.innerHTML = '';
        if (!files.length) grid.appendChild(el('p', { class: 'hint' }, ['No uploads yet.']));
        files.forEach(function (f) {
          grid.appendChild(el('div', { class: 'lib-tile' }, [
            el('div', { class: 'thumb' }, [el(f.kind === 'video' ? 'video' : 'img', { src: f.url, muted: '' })]),
            el('div', { class: 'meta' }, [
              el('span', { class: 'kind-badge' }, [f.kind]),
              el('div', { class: 'nm' }, [f.name]),
              el('div', { class: 'row' }, [
                el('button', { class: 'mini-btn copy', onclick: function () { navigator.clipboard.writeText(f.url); toast('URL copied', 'ok'); } }, ['Copy URL']),
                el('button', { class: 'mini-btn danger', onclick: function () { if (confirm('Delete this file?')) api('DELETE', '/api/admin/media/' + encodeURIComponent(f.name)).then(load); } }, ['Delete'])
              ])
            ])
          ]));
        });
      });
    }
    setTimeout(load, 0);
    return [card('Media Library', 'Every image and video you have uploaded. Copy a URL to reuse it anywhere.', [
      el('label', { class: 'upload-btn', style: 'display:inline-block;margin-bottom:16px' }, ['⬆ Upload images / videos', dropUpload]),
      grid
    ])];
  };

  R.settings = function () {
    var cur = el('input', { type: 'password', placeholder: 'Current password' });
    var nw = el('input', { type: 'password', placeholder: 'New password (min 6 chars)' });
    var cf = el('input', { type: 'password', placeholder: 'Confirm new password' });
    var btn = el('button', { class: 'btn-primary', onclick: function () {
      if (nw.value !== cf.value) return toast('New passwords do not match', 'err');
      api('POST', '/api/admin/password', { currentPassword: cur.value, newPassword: nw.value })
        .then(function () { cur.value = nw.value = cf.value = ''; var b = document.getElementById('pwBanner'); if (b) b.remove(); toast('Password updated', 'ok'); })
        .catch(function (e) { toast(e.message, 'err'); });
    } }, ['Update Password']);
    return [card('Change Password', 'Logged in as "' + (window.__USER__ && window.__USER__.username) + '". Choose a strong password.', [
      el('div', { class: 'fld' }, [el('label', {}, ['Current Password']), cur]),
      el('div', { class: 'fld' }, [el('label', {}, ['New Password']), nw]),
      el('div', { class: 'fld' }, [el('label', {}, ['Confirm New Password']), cf]),
      el('div', { class: 'save-row' }, [btn])
    ])];
  };

  /* ---------------- small builders ---------------- */
  function card(title, hint, kids) {
    return el('div', { class: 'card' }, [
      el('h2', {}, [title]),
      hint ? el('p', { class: 'hint' }, [hint]) : null
    ].concat(kids));
  }
  function addButton(label, onClick) {
    return el('button', { class: 'add-btn', onclick: onClick }, [label]);
  }

  /* ---------------- render / routing ---------------- */
  function render(tab) {
    currentTab = tab;
    tabTitle.textContent = TAB_LABELS[tab];
    panel.innerHTML = '';
    var nodes = R[tab](state.content);
    nodes.forEach(function (n) { panel.appendChild(n); });
    window.scrollTo(0, 0);
  }

  document.getElementById('sideNav').addEventListener('click', function (e) {
    var btn = e.target.closest('.side-link');
    if (!btn) return;
    document.querySelectorAll('.side-link').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    render(btn.getAttribute('data-tab'));
  });
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) {
      var t = g.getAttribute('data-goto');
      var link = document.querySelector('.side-link[data-tab="' + t + '"]');
      if (link) link.click();
    }
  });

  /* ---------------- boot ---------------- */
  api('GET', '/api/admin/state').then(function (s) {
    state.content = s.content;
    state.pendingChanges = s.pendingChanges;
    state.lastPublished = s.lastPublished;
    refreshPublishState();
    render('hero');
  }).catch(function (e) { toast('Failed to load: ' + e.message, 'err'); });
})();
