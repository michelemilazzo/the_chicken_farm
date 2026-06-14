frappe.provide("tcf");

tcf.BookingManager = class {
	constructor(wrapper) {
		this.wrapper = wrapper;
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: __("Booking Manager"),
			single_column: true,
		});
		this.current_date = frappe.datetime.get_today();
		this.data = { reservations: [], tables: [], stats: {} };
		this.active_filter = "all";
		this._table_map = {};

		this.make();
		this.bind_events();
		this.load(this.current_date);
		this._timer = setInterval(() => this.load(this.current_date), 60000);
	}

	make() {
		$(this.page.main).html(`
			<div class="bm-wrap">
				<div class="bm-header">
					<div class="bm-date-nav">
						<button class="btn btn-default btn-sm bm-nav-btn" id="bm-prev">‹</button>
						<input type="date" id="bm-date-input" class="form-control form-control-sm bm-date-input">
						<button class="btn btn-sm bm-today-btn" id="bm-today">Oggi</button>
						<button class="btn btn-default btn-sm bm-nav-btn" id="bm-next">›</button>
					</div>
					<div class="bm-stats">
						<div class="bm-stat bm-stat-pending">
							<span class="bm-stat-val" id="s-pending">–</span>
							<span class="bm-stat-lbl">In attesa</span>
						</div>
						<div class="bm-stat bm-stat-confirmed">
							<span class="bm-stat-val" id="s-confirmed">–</span>
							<span class="bm-stat-lbl">Confermati</span>
						</div>
						<div class="bm-stat bm-stat-arrived">
							<span class="bm-stat-val" id="s-arrived">–</span>
							<span class="bm-stat-lbl">Arrivati</span>
						</div>
						<div class="bm-stat bm-stat-cancelled">
							<span class="bm-stat-val" id="s-cancelled">–</span>
							<span class="bm-stat-lbl">Cancellati</span>
						</div>
						<div class="bm-stat bm-stat-people">
							<span class="bm-stat-val" id="s-people">–</span>
							<span class="bm-stat-lbl">Coperti</span>
						</div>
					</div>
				</div>
				<div class="bm-body">
					<div class="bm-col-res">
						<div class="bm-col-head">
							<span class="bm-col-title">Prenotazioni</span>
							<div class="bm-filters">
								<button class="bm-filter active" data-filter="all">Tutte</button>
								<button class="bm-filter" data-filter="Pending">In attesa</button>
								<button class="bm-filter" data-filter="Confirmed">Confermate</button>
								<button class="bm-filter" data-filter="Arrived">Arrivati</button>
							</div>
						</div>
						<div id="bm-res-list" class="bm-list-content">
							<div class="bm-empty text-muted text-center py-4">Caricamento…</div>
						</div>
					</div>
					<div class="bm-col-tables">
						<div class="bm-col-head">
							<span class="bm-col-title">Tavoli</span>
							<button class="btn btn-primary btn-sm" id="bm-walkin">+ Walk-in</button>
						</div>
						<div id="bm-tables-content" class="bm-list-content">
							<div class="bm-empty text-muted text-center py-4">Caricamento…</div>
						</div>
					</div>
				</div>
			</div>
		`);
	}

	bind_events() {
		let $m = $(this.page.main);
		$m.find("#bm-prev").on("click", () => this.shift(-1));
		$m.find("#bm-today").on("click", () => this.load(frappe.datetime.get_today()));
		$m.find("#bm-next").on("click", () => this.shift(1));
		$m.find("#bm-date-input").on("change", (e) => this.load(e.target.value));
		$m.find("#bm-walkin").on("click", () => this.open_walk_in());

		$m.on("click", ".bm-filter", (e) => {
			$m.find(".bm-filter").removeClass("active");
			let $btn = $(e.currentTarget);
			$btn.addClass("active");
			this.active_filter = $btn.data("filter");
			this.render_reservations(this.data.reservations || []);
		});

		$m.on("click", ".bm-action", (e) => {
			let $btn = $(e.currentTarget);
			let action = $btn.data("action");
			let name = $btn.data("name");
			if (action === "confirm") this.do_confirm(name, $btn.data("time"), $btn.data("people"));
			else if (action === "assign") this.do_assign(name, $btn.data("time"), $btn.data("people"));
			else if (action === "reject") this.do_reject(name);
			else if (action === "arrived") this.do_set_status(name, "Arrived");
			else if (action === "noshow") this.do_set_status(name, "No Show");
		});

		$m.on("click", ".bm-table-card", (e) => {
			this.show_table_info($(e.currentTarget).data("table"));
		});
	}

	shift(delta) {
		this.load(frappe.datetime.add_days(this.current_date, delta));
	}

	load(date) {
		this.current_date = date;
		let $m = $(this.page.main);
		$m.find("#bm-date-input").val(date);
		$m.find("#bm-res-list").html('<div class="bm-empty text-muted text-center py-4">Caricamento…</div>');
		$m.find("#bm-tables-content").html('<div class="bm-empty text-muted text-center py-4">Caricamento…</div>');

		frappe.call({
			method: "the_chicken_farm.api.get_day_data",
			args: { date },
			freeze: false,
			callback: (r) => {
				if (!r.message) return;
				this.data = r.message;
				this.render_stats(r.message.stats || {});
				this.render_reservations(r.message.reservations || []);
				this.render_tables(r.message.tables || []);
			},
		});
	}

	render_stats(s) {
		let $m = $(this.page.main);
		$m.find("#s-pending").text(s.pending ?? "–");
		$m.find("#s-confirmed").text(s.confirmed ?? "–");
		$m.find("#s-arrived").text(s.arrived ?? "–");
		$m.find("#s-cancelled").text(s.cancelled ?? "–");
		$m.find("#s-people").text(s.people ?? "–");
	}

	status_cls(st) {
		return { Pending: "pending", Confirmed: "confirmed", Arrived: "arrived", Cancelled: "cancelled", "No Show": "no-show" }[st] || "pending";
	}

	status_lbl(st) {
		return { Pending: "In attesa", Confirmed: "Confermata", Arrived: "Arrivata", Cancelled: "Cancellata", "No Show": "No Show" }[st] || st;
	}

	render_reservations(list) {
		let filtered = this.active_filter === "all" ? list : list.filter((r) => r.status === this.active_filter);
		let $el = $(this.page.main).find("#bm-res-list");

		if (!filtered.length) {
			$el.html('<div class="bm-empty text-muted text-center py-4">Nessuna prenotazione</div>');
			return;
		}

		let html = filtered
			.map((r) => {
				let sc = this.status_cls(r.status);
				let time = (r.reservation_time || "").substring(0, 5);
				let actions = "";

				if (r.status === "Pending") {
					actions = `
					<button class="btn btn-xs btn-success bm-action" data-action="confirm" data-name="${r.name}" data-time="${r.reservation_time}" data-people="${r.people_count}">✓ Conferma</button>
					<button class="btn btn-xs bm-btn-assign bm-action" data-action="assign" data-name="${r.name}" data-time="${r.reservation_time}" data-people="${r.people_count}">🪑 Tavolo</button>
					<button class="btn btn-xs btn-default bm-action" data-action="reject" data-name="${r.name}">✗ Rifiuta</button>
				`;
				} else if (r.status === "Confirmed") {
					actions = `
					<button class="btn btn-xs btn-primary bm-action" data-action="arrived" data-name="${r.name}">✓ Arrivato</button>
					<button class="btn btn-xs bm-btn-assign bm-action" data-action="assign" data-name="${r.name}" data-time="${r.reservation_time}" data-people="${r.people_count}">🪑 Tavolo</button>
					<button class="btn btn-xs btn-default bm-action" data-action="noshow" data-name="${r.name}">No Show</button>
				`;
				}

				return `
				<div class="bm-res-card bm-res-${sc}">
					<div class="bm-res-head">
						<span class="bm-res-time">${time}</span>
						<div class="bm-res-info">
							<div class="bm-res-name">${frappe.utils.escape_html(r.customer_name)}</div>
							<div class="bm-res-meta text-muted">
								👥 ${r.people_count}${r.children_count ? " (+" + r.children_count + " 👶)" : ""}
								${r.assigned_table ? `&nbsp;·&nbsp;🪑 <strong>${r.assigned_table}</strong>` : ""}
							</div>
						</div>
						<span class="indicator-pill ${this.indicator_color(r.status)}">${this.status_lbl(r.status)}</span>
					</div>
					<div class="bm-res-body">
						<div class="bm-res-contacts">
							${r.phone ? `<a href="tel:${r.phone}" class="bm-contact">📞 ${r.phone}</a>` : ""}
							${r.email ? `<a href="mailto:${r.email}" class="bm-contact">✉ ${r.email}</a>` : ""}
						</div>
						${r.allergy_notes ? `<div class="bm-allergy">⚠️ ${frappe.utils.escape_html(r.allergy_notes)}</div>` : ""}
						${r.event_notes ? `<div class="bm-note text-muted">📝 ${frappe.utils.escape_html(r.event_notes)}</div>` : ""}
						${actions ? `<div class="bm-actions">${actions}</div>` : ""}
					</div>
				</div>
			`;
			})
			.join("");

		$el.html(html);
	}

	indicator_color(status) {
		return { Pending: "orange", Confirmed: "green", Arrived: "blue", Cancelled: "gray", "No Show": "gray" }[status] || "gray";
	}

	render_tables(tables) {
		let areas = {};
		tables.forEach((t) => {
			areas[t.area] = areas[t.area] || [];
			areas[t.area].push(t);
		});

		let html = Object.keys(areas)
			.sort()
			.map((area) => {
				let cards = areas[area]
					.map((t) => {
						let cls = t.lunch === "reserved" && t.dinner === "reserved" ? "full" : t.lunch === "reserved" || t.dinner === "reserved" ? "partial" : "free";
						let tooltip = t.reservations && t.reservations.length ? t.reservations.map((r) => `${(r.reservation_time || "").substring(0, 5)} ${r.customer_name}`).join("\n") : "Libero";
						return `
						<div class="bm-table-card bm-table-${cls}" title="${frappe.utils.escape_html(tooltip)}" data-table="${t.name}">
							<div class="bm-t-num">T${t.table_number}</div>
							<div class="bm-t-cap text-muted">${t.capacity} posti</div>
							<div class="bm-t-slots">
								<span class="bm-slot bm-slot-${t.lunch}">P</span>
								<span class="bm-slot bm-slot-${t.dinner}">C</span>
							</div>
						</div>
					`;
					})
					.join("");
				return `
				<div class="bm-area-section">
					<div class="bm-area-title">${frappe.utils.escape_html(area)}</div>
					<div class="bm-tables-grid">${cards}</div>
				</div>
			`;
			})
			.join("");

		$(this.page.main).find("#bm-tables-content").html(html);
	}

	show_table_info(table_name) {
		let table = (this.data.tables || []).find((t) => t.name === table_name);
		if (!table) return;

		let content = "";
		if (table.reservations && table.reservations.length) {
			content =
				"<table class='table table-sm'><thead><tr><th>Ora</th><th>Nome</th><th>Pax</th><th>Stato</th></tr></thead><tbody>" +
				table.reservations
					.map(
						(r) =>
							`<tr><td>${(r.reservation_time || "").substring(0, 5)}</td><td>${frappe.utils.escape_html(r.customer_name)}</td><td>${r.people_count}</td><td>${this.status_lbl(r.status)}</td></tr>`
					)
					.join("") +
				"</tbody></table>";
		} else {
			content = '<p class="text-success font-weight-bold mt-2">Tavolo libero</p>';
		}

		let d = new frappe.ui.Dialog({
			title: `T${table.table_number} – ${table.area} (${table.capacity} posti)`,
			fields: [{ fieldtype: "HTML", options: content }],
		});
		d.show();
	}

	_table_options(tables, optional) {
		this._table_map = {};
		let opts = tables.map((t) => {
			let lbl = `T${t.table_number} (${t.area}) – ${t.capacity} posti`;
			this._table_map[lbl] = t.name;
			return lbl;
		});
		if (optional) opts.unshift("— Nessuno —");
		return opts.join("\n");
	}

	do_confirm(name, time_str, people) {
		frappe.call({
			method: "the_chicken_farm.api.get_available_tables",
			args: { date: this.current_date, time_str, people_count: people },
			callback: (r) => {
				let opts = this._table_options(r.message || [], true);
				let d = new frappe.ui.Dialog({
					title: __("Conferma prenotazione"),
					fields: [{ fieldtype: "Select", fieldname: "table_name", label: __("Assegna tavolo (opzionale)"), options: opts }],
					primary_action_label: __("Conferma"),
					primary_action: (vals) => {
						let tname = this._table_map[vals.table_name] || null;
						frappe.call({
							method: "the_chicken_farm.api.confirm_reservation",
							args: { name, table_name: tname },
							callback: () => { d.hide(); this.load(this.current_date); },
						});
					},
				});
				d.show();
			},
		});
	}

	do_assign(name, time_str, people) {
		frappe.call({
			method: "the_chicken_farm.api.get_available_tables",
			args: { date: this.current_date, time_str, people_count: people },
			callback: (r) => {
				let tables = r.message || [];
				let opts = this._table_options(tables, false);
				if (!opts) {
					frappe.show_alert({ message: __("Nessun tavolo disponibile"), indicator: "orange" });
					return;
				}
				let d = new frappe.ui.Dialog({
					title: __("Assegna tavolo"),
					fields: [{ fieldtype: "Select", fieldname: "table_name", label: __("Tavolo"), options: opts, reqd: 1 }],
					primary_action_label: __("Assegna"),
					primary_action: (vals) => {
						let tname = this._table_map[vals.table_name];
						if (!tname) return;
						frappe.call({
							method: "the_chicken_farm.api.assign_table",
							args: { name, table_name: tname },
							callback: () => { d.hide(); this.load(this.current_date); },
						});
					},
				});
				d.show();
			},
		});
	}

	do_reject(name) {
		let d = new frappe.ui.Dialog({
			title: __("Rifiuta prenotazione"),
			fields: [{ fieldtype: "Data", fieldname: "reason", label: __("Motivo (opzionale)"), placeholder: "es. locale pieno, data chiusura…" }],
			primary_action_label: __("Rifiuta"),
			primary_action: (vals) => {
				frappe.call({
					method: "the_chicken_farm.api.reject_reservation",
					args: { name, reason: vals.reason || "" },
					callback: () => { d.hide(); this.load(this.current_date); },
				});
			},
		});
		d.show();
	}

	do_set_status(name, status) {
		frappe.call({
			method: "the_chicken_farm.api.set_arrival_status",
			args: { name, status },
			callback: () => this.load(this.current_date),
		});
	}

	open_walk_in() {
		let free_tables = (this.data.tables || []).filter((t) => t.lunch === "free" || t.dinner === "free");
		let opts = this._table_options(free_tables, false);

		let d = new frappe.ui.Dialog({
			title: __("Walk-in"),
			fields: [
				{ fieldtype: "Select", fieldname: "table_name", label: __("Tavolo"), options: opts, reqd: 1 },
				{ fieldtype: "Int", fieldname: "people_count", label: __("Persone"), default: 2, reqd: 1 },
				{ fieldtype: "Int", fieldname: "children_count", label: __("Bambini"), default: 0 },
				{ fieldtype: "Data", fieldname: "note", label: __("Nota"), placeholder: "Occasione speciale…" },
			],
			primary_action_label: __("Crea Walk-in"),
			primary_action: (vals) => {
				let tname = this._table_map[vals.table_name];
				if (!tname) { frappe.msgprint(__("Seleziona un tavolo")); return; }
				frappe.call({
					method: "the_chicken_farm.api.create_walk_in",
					args: {
						table_name: tname,
						people_count: vals.people_count || 2,
						children_count: vals.children_count || 0,
						note: vals.note || "",
					},
					callback: () => { d.hide(); this.load(this.current_date); },
				});
			},
		});
		d.show();
	}
};

frappe.pages["booking-manager"].on_page_load = function (wrapper) {
	wrapper.booking_manager = new tcf.BookingManager(wrapper);
};

frappe.pages["booking-manager"].on_page_show = function (wrapper) {
	if (wrapper.booking_manager) {
		wrapper.booking_manager.load(wrapper.booking_manager.current_date);
	}
};
