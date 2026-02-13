import{$ as cr,$a as yt,$c as Dr,A as ar,Aa as U,Ab as w,Ac as Re,Ad as Mr,B as G,Bb as Cr,Bd as Lr,C as na,Ca as rn,Cb as Ie,Cc as tt,Cd as ma,D as he,Da as ur,Db as Ir,Dc as it,Ec as H,F as nn,Fb as u,Fc as _n,Fd as at,G as ft,Gb as Tt,Gd as Rt,H as rt,Hb as W,Hc as ne,Ib as ue,Ic as we,Id as Nr,J as or,Jb as oe,Jc as le,Jd as dt,K as ra,Kb as Oe,Kc as Ar,Kd as un,L as nr,Lb as dn,Lc as Di,Ld as L,M as Vt,Mb as C,Mc as T,N as rr,Nb as $e,Nc as Ei,O as lr,Oc as kt,P as la,Pc as ca,Pd as St,Qd as xe,R as re,Rd as Br,S as dr,Sa as gr,Sd as ct,Tc as jt,Td as Fe,Uc as R,Va as br,Vc as J,W as V,Wc as hn,X as Si,Xc as Ot,Xd as Ur,Yc as v,Zc as xt,_ as Ci,_c as Pr,a as D,ab as ln,ac as da,ad as st,b as te,bb as Ye,bc as Q,cb as fr,cc as Wn,db as yr,dc as cn,e as nt,ed as Er,fc as ve,g as Ee,gc as Gn,gd as Tr,h as ut,ha as ye,hc as pe,i as gt,id as Ud,j as Ce,jd as Ti,k as d,ka as mr,kc as ge,kd as ki,lc as ie,ld as kr,m as Kn,mc as mn,md as Zn,n as Y,na as Ii,o as er,oa as B,oc as vt,od as Or,p as N,pa as A,pc as k,q as je,qa as pr,qc as wr,r as tr,ra as hr,rc as pn,rd as lt,s as an,sa as wi,sb as vr,sc as Vn,sd as Rr,ta as f,tb as Et,tc as _t,u as Fn,ub as xr,uc as Zt,v as on,vb as Ai,w as ir,wa as Ue,wb as Sr,x as sr,xa as p,xb as Pi,xc as K,y as bt,ya as Ve,yc as I,z as zn,za as h,zb as b}from"./chunk-YL7DWODI.js";var Me;(function(m){m[m.Draft=1]="Draft",m[m.Published=2]="Published",m[m.PublishedEdited=3]="PublishedEdited"})(Me||(Me={}));var jn,Oi,Yt=(Oi=class{transform(e){return jn.map[e]}},jn=Oi,Oi.map={0:"-",1:"Disabled",2:"Restricted",3:"&nbsp;"},Oi);Yt=jn=d([Ve({name:"lmAccessState"})],Yt);var S=class m{static accessState(e,t,i,s){return Yt.map[i]}static date(e,t,i,s){return W.getLocaleDateString(i)}static restricted(e,t,i,s){return i?"Restricted":"&nbsp;"}static pageOrWidgetType(e,t,i,s){return i?"Standard":"Published"}static text(e,t,i,s){return oe.escapeStringForHtml(i)}static dynamicPageStatus(e,t,i,s){switch(i){case Me.Draft:return"Draft";case Me.Published:return"Published";case Me.PublishedEdited:return"Published (Edited)";default:return"Unknown"}}static archiveType(e,t,i,s){return i===Ei.DynamicPage?"Dynamic":"Unknown"}static propertyDataType(e,t,i,s){switch(i){case"op":return"Operation";case"fnc":return"Function";case"b":return"Boolean";case"s":return"String";case"n":return"Number";case"d":return"Date";default:return"Unknown"}}static displayName(e,t,i,s){return i?m.text(e,t,i,s):"Unknown"}static dynamicDisabledExpander(e,t,i,s,a,o){return a.err&&(i=`
				<svg class="icon datagrid-alert-icon icon-alert lm-admin-page-warn-icon"
					focusable="false"
					aria-hidden="true"
					role="presentation">
					<use xlink:href="#icon-alert"></use>
				</svg>
				<span class="lm-margin-sm-l lm-text-alert">${i}</span>
			`),Formatters.Expander(e,t,i,s,a,o)}},Le=class m{static getPageDisplayValue(e){return e?e.indexOf("{")>=0&&e==='{"pages":[]}'?"<not set>":"Edit...":"<not set>"}static getDisplayValue(e,t){let i=ve,s=e.type,a;if(e.type===i.typeDefaultPages||e.type===i.typeMandatoryPages)a=m.getPageDisplayValue(t);else if(s===i.typeSelector){let o=u.itemByProperty(e.setting.values,"value",t);o?a=o.label:a=t}else a=`${t}`;return a}static mergePages(e,t){if(!e)return t;for(let i of t)u.indexByPredicate(e,s=>s.data.id===i.data.id)<0&&e.push(i);return e}static pageSelectorOptions(e,t){let i=e.settingName===K.mandatoryPages;return{title:e.setting.label,isMultiSelect:i,noShowIds:t.map(s=>s.data.id)}}static getPageSelectorValue(e){if(!e||e.length===0)return"";let i={pages:e.map(s=>({id:s.data.id}))};return JSON.stringify(i)}static isSameConnection(e,t){return!!(e&&t&&e.isUser===t.isUser&&e.name===t.name)}static hasConnection(e,t){return!!u.find(e,i=>m.isSameConnection(t,i))}},Mt=class{static getAccessCopy(e){if(!e)return e;let t=[];for(let i of e)t.push(i);return t}},fe=class{static formatError(e){return`<div>${$.createIcon({icon:"error",classes:["icon","datagrid-alert-icon","icon-error"]})}<span class="lm-margin-sm-l text-alert">${e}</span></div>`}static formatAlert(e,t){return`<div>${$.createIcon({icon:"alert",classes:["icon","datagrid-alert-icon","icon-alert"]})}<span class="lm-margin-sm-l${t?" lm-text-alert":""}">${e}</span></div>`}};var Fr=`\uFEFF<div\r
	class="lm-size-full"\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	*ngIf="showPage$ | async as showPage">\r
	<nav\r
		id="application-menu"\r
		soho-application-menu\r
		[triggers]="applicationMenuTriggers"\r
		openOnLarge="true"\r
		(menuVisibility)="onMenuToggled($event)"\r
		*ngIf="canNavigateTo$ | async as canNavigateTo">\r
		<div class="accordion panel inverse" data-options='{"allowOnePane": false}'>\r
			<div class="accordion-header lm-admin-app-menu-header is-disabled">\r
				<h1 class="lm-admin-app-menu-header-text" id="lm-a-men-hdr-hdr">\r
					Homepages Administration\r
				</h1>\r
				<h2 class="lm-admin-app-menu-header-text" id="lm-a-men-hdr-hdr2">\r
					Tenant: {{ tenant$ | async }}\r
				</h2>\r
			</div>\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Home]"\r
				[class.is-selected]="showPage === AdminPages.Home">\r
				<svg soho-icon icon="home"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-hom"\r
					(click)="changeTab(AdminPages.Home, $event)">\r
					<span>{{ AdminPages[AdminPages.Home] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Settings]"\r
				[class.is-selected]="showPage === AdminPages.Settings">\r
				<svg soho-icon icon="settings"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-set"\r
					(click)="changeTab(AdminPages.Settings, $event)">\r
					<span>{{ AdminPages[AdminPages.Settings] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Features]"\r
				[class.is-selected]="showPage === AdminPages.Features">\r
				<svg soho-icon icon="new"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-ftr"\r
					(click)="changeTab(AdminPages.Features, $event)">\r
					<span>{{ AdminPages[AdminPages.Features] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Properties]"\r
				[class.is-selected]="showPage === AdminPages.Properties">\r
				<svg soho-icon icon="connections"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-prp"\r
					(click)="changeTab(AdminPages.Properties, $event)">\r
					<span>{{ AdminPages[AdminPages.Properties] }}</span>\r
				</a>\r
			</div>\r
\r
			<div class="accordion-header">\r
				<svg soho-icon icon="document"></svg>\r
				<a href="" id="lm-a-men-p">\r
					<span>Pages</span>\r
				</a>\r
			</div>\r
			<div class="accordion-pane">\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.PrivatePages]"\r
					[class.is-selected]="showPage === AdminPages.PrivatePages">\r
					<a\r
						href=""\r
						id="lm-a-men-p-prv"\r
						(click)="changeTab(AdminPages.PrivatePages, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.PrivatePages] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.PublishedPages]"\r
					[class.is-selected]="showPage === AdminPages.PublishedPages">\r
					<a\r
						href=""\r
						id="lm-a-men-p-pub"\r
						(click)="changeTab(AdminPages.PublishedPages, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.PublishedPages] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.StandardPages]"\r
					[class.is-selected]="showPage === AdminPages.StandardPages">\r
					<a\r
						href=""\r
						id="lm-a-men-p-std"\r
						(click)="changeTab(AdminPages.StandardPages, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.StandardPages] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.DynamicPages]"\r
					[class.is-selected]="showPage === AdminPages.DynamicPages">\r
					<a\r
						href=""\r
						id="lm-a-men-p-dyn"\r
						(click)="changeTab(AdminPages.DynamicPages, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.DynamicPages] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.Archive]"\r
					[class.is-selected]="showPage === AdminPages.Archive">\r
					<a\r
						href=""\r
						id="lm-a-men-p-arc"\r
						(click)="changeTab(AdminPages.Archive, $event)">\r
						<span>{{ AdminPages[AdminPages.Archive] }}</span>\r
					</a>\r
				</div>\r
			</div>\r
\r
			<div class="accordion-header">\r
				<svg class="icon" aria-hidden="true" focusable="false">\r
					<use xlink:href="#lime-icon-widget" />\r
				</svg>\r
				<a href="" id="lm-a-men-w">\r
					<span>Widgets</span>\r
				</a>\r
			</div>\r
			<div class="accordion-pane">\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.PublishedWidgets]"\r
					[class.is-selected]="showPage === AdminPages.PublishedWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-w-pub"\r
						(click)="changeTab(AdminPages.PublishedWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.PublishedWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.StandardWidgets]"\r
					[class.is-selected]="showPage === AdminPages.StandardWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-w-std"\r
						(click)="changeTab(AdminPages.StandardWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.StandardWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.TenantWidgets]"\r
					[class.is-selected]="showPage === AdminPages.TenantWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-w-tnt"\r
						(click)="changeTab(AdminPages.TenantWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.TenantWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.EarlyAccessWidgets]"\r
					[class.is-selected]="showPage === AdminPages.EarlyAccessWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-w-ea"\r
						(click)="changeTab(AdminPages.EarlyAccessWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.EarlyAccessWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
			</div>\r
\r
			<div class="accordion-header">\r
				<svg soho-icon icon="star-outlined"></svg>\r
				<a href="" id="lm-a-men-ftr-c">\r
					<span>Featured Content</span>\r
				</a>\r
			</div>\r
			<div class="accordion-pane">\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.FeaturedPages]"\r
					[class.is-selected]="showPage === AdminPages.FeaturedPages">\r
					<a\r
						href=""\r
						id="lm-a-men-ftr-p"\r
						(click)="changeTab(AdminPages.FeaturedPages, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.FeaturedPages] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.FeaturedWidgets]"\r
					[class.is-selected]="showPage === AdminPages.FeaturedWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-ftr-w"\r
						(click)="changeTab(AdminPages.FeaturedWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.FeaturedWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
				<div\r
					class="accordion-header list-item"\r
					[hidden]="!canNavigateTo[AdminPages.FeaturedBannerWidgets]"\r
					[class.is-selected]="showPage === AdminPages.FeaturedBannerWidgets">\r
					<a\r
						href=""\r
						id="lm-a-men-ftr-wb"\r
						(click)="changeTab(AdminPages.FeaturedBannerWidgets, $event)">\r
						<span>{{\r
							AdminPages[AdminPages.FeaturedBannerWidgets] | lmCamelCaseSpace\r
						}}</span>\r
					</a>\r
				</div>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Tags]"\r
				[class.is-selected]="showPage === AdminPages.Tags">\r
				<svg class="icon" aria-hidden="true" focusable="false">\r
					<use xlink:href="#lime-icon-tags" />\r
				</svg>\r
				<a\r
					href=""\r
					id="lm-a-men-tag"\r
					(click)="changeTab(AdminPages.Tags, $event)">\r
					<span>{{ AdminPages[AdminPages.Tags] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Announcements]"\r
				[class.is-selected]="showPage === AdminPages.Announcements">\r
				<svg class="icon" aria-hidden="true" focusable="false">\r
					<use xlink:href="#lime-icon-announcement" />\r
				</svg>\r
				<a\r
					href=""\r
					id="lm-a-men-ann"\r
					(click)="changeTab(AdminPages.Announcements, $event)">\r
					<span>{{ AdminPages[AdminPages.Announcements] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.SecurityPolicies]"\r
				[class.is-selected]="showPage === AdminPages.SecurityPolicies">\r
				<svg soho-icon icon="locked"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-sp"\r
					(click)="changeTab(AdminPages.SecurityPolicies, $event)">\r
					<span>{{\r
						AdminPages[AdminPages.SecurityPolicies] | lmCamelCaseSpace\r
					}}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Import]"\r
				[class.is-selected]="showPage === AdminPages.Import">\r
				<svg soho-icon icon="import"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-im"\r
					(click)="changeTab(AdminPages.Import, $event)">\r
					<span>{{ AdminPages[AdminPages.Import] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.Export]"\r
				[class.is-selected]="showPage === AdminPages.Export">\r
				<svg soho-icon icon="export"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-ex"\r
					(click)="changeTab(AdminPages.Export, $event)">\r
					<span>{{ AdminPages[AdminPages.Export] }}</span>\r
				</a>\r
			</div>\r
\r
			<div\r
				class="accordion-header list-item"\r
				[hidden]="!canNavigateTo[AdminPages.BulkDelete]"\r
				[class.is-selected]="showPage === AdminPages.BulkDelete">\r
				<svg soho-icon icon="delete"></svg>\r
				<a\r
					href=""\r
					id="lm-a-men-bd"\r
					(click)="changeTab(AdminPages.BulkDelete, $event)"\r
					id="lm-a-nav-bd">\r
					<span>{{\r
						AdminPages[AdminPages.BulkDelete] | lmCamelCaseSpace\r
					}}</span>\r
				</a>\r
			</div>\r
		</div>\r
		<div class="branding">\r
			<svg\r
				class="icon"\r
				viewBox="0 0 34 34"\r
				focusable="false"\r
				aria-hidden="true"\r
				role="presentation">\r
				<use xlink:href="#icon-logo"></use>\r
			</svg>\r
		</div>\r
	</nav>\r
\r
	<div class="page-container">\r
		<header class="header lm-admin-header">\r
			<soho-toolbar\r
				[maxVisibleButtons]="2"\r
				[hasMoreButton]="false"\r
				[favorButtonset]="true">\r
				<soho-toolbar-title>\r
					<button soho-nav-button id="lm-admin-appmenu-trigger">\r
						Toggle menu\r
					</button>\r
					<h1 id="lm-admin-pagetitle">\r
						{{ AdminPages[showPage] | lmCamelCaseSpace }}\r
					</h1>\r
				</soho-toolbar-title>\r
\r
				<soho-toolbar-button-set>\r
					<button\r
						soho-button="icon"\r
						icon="quick-access"\r
						(click)="hide()"\r
						id="lm-hide-admin-btn"\r
						soho-tooltip\r
						title="Switch to Homepages">\r
						<span class="audible">Switch to Homepages</span>\r
					</button>\r
					<button\r
						soho-button="btn"\r
						icon="close"\r
						(click)="close()"\r
						id="lm-close-admin-btn">\r
						Close\r
					</button>\r
				</soho-toolbar-button-set>\r
			</soho-toolbar>\r
		</header>\r
		<div\r
			class="lm-admin-container lm-scroll-auto scrollable"\r
			*ngIf="openedPages$ | async as openedPages"\r
			id="lmAdmCnt"\r
			[ngClass]="{\r
				'lm-admin-dyn-editor-opened':\r
					(isDynamicEditorOpen$ | async) && showPage === AdminPages.DynamicPages\r
			}">\r
			<div *ngIf="showPage === AdminPages.Home">\r
				<lm-admin-home\r
					(changeTab)="changeTab($event.page, $event.event)"></lm-admin-home>\r
			</div>\r
			<div\r
				class="row"\r
				[class.lm-margin-xl-t]="showPage !== AdminPages.DynamicPages">\r
				<div class="twelve columns">\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Settings)"\r
						[class.lm-display-none]="showPage !== AdminPages.Settings">\r
						<lm-admin-settings></lm-admin-settings>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Features)"\r
						[class.lm-display-none]="showPage !== AdminPages.Features">\r
						<lm-admin-settings [isFeatureMode]="true"></lm-admin-settings>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Properties)"\r
						[class.lm-display-none]="showPage !== AdminPages.Properties">\r
						<lm-admin-properties></lm-admin-properties>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.PrivatePages)"\r
						[class.lm-display-none]="showPage !== AdminPages.PrivatePages"\r
						class="lm-margin-lg-t">\r
						<lm-admin-private-pages></lm-admin-private-pages>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.PublishedPages)"\r
						[class.lm-display-none]="showPage !== AdminPages.PublishedPages">\r
						<lm-admin-published-pages></lm-admin-published-pages>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.StandardPages)"\r
						[class.lm-display-none]="showPage !== AdminPages.StandardPages">\r
						<lm-admin-standard-pages\r
							(onGoToFeatures)="changeTab($event)"></lm-admin-standard-pages>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.PublishedWidgets)"\r
						[class.lm-display-none]="showPage !== AdminPages.PublishedWidgets">\r
						<lm-admin-published-widgets></lm-admin-published-widgets>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.StandardWidgets)"\r
						[class.lm-display-none]="showPage !== AdminPages.StandardWidgets">\r
						<lm-admin-standard-widgets></lm-admin-standard-widgets>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.TenantWidgets)"\r
						[class.lm-display-none]="showPage !== AdminPages.TenantWidgets">\r
						<lm-admin-tenant-widgets></lm-admin-tenant-widgets>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.EarlyAccessWidgets)"\r
						[class.lm-display-none]="\r
							showPage !== AdminPages.EarlyAccessWidgets\r
						">\r
						<lm-admin-early-access-widgets></lm-admin-early-access-widgets>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.FeaturedPages)"\r
						[class.lm-display-none]="showPage !== AdminPages.FeaturedPages">\r
						<lm-admin-featured\r
							[entityType]="featureType.page"></lm-admin-featured>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.FeaturedWidgets)"\r
						[class.lm-display-none]="showPage !== AdminPages.FeaturedWidgets">\r
						<lm-admin-featured\r
							[entityType]="featureType.widget"></lm-admin-featured>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.FeaturedBannerWidgets)"\r
						[class.lm-display-none]="\r
							showPage !== AdminPages.FeaturedBannerWidgets\r
						">\r
						<lm-admin-featured\r
							[entityType]="featureType.banner"\r
							(onGoToFeatures)="changeTab($event)"></lm-admin-featured>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Tags)"\r
						[class.lm-display-none]="showPage !== AdminPages.Tags">\r
						<lm-admin-tags></lm-admin-tags>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Announcements)"\r
						[class.lm-display-none]="showPage !== AdminPages.Announcements">\r
						<lm-admin-memos\r
							[expressionFilter]="expressionFilter"></lm-admin-memos>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.SecurityPolicies)"\r
						[class.lm-display-none]="showPage !== AdminPages.SecurityPolicies">\r
						<lm-admin-policies\r
							(onNavigationEvent)="\r
								onNavigationEvent($event)\r
							"></lm-admin-policies>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Archive)"\r
						[class.lm-display-none]="showPage !== AdminPages.Archive">\r
						<lm-admin-archive></lm-admin-archive>\r
					</div>\r
					<div\r
						[class.lm-display-none]="showPage !== AdminPages.Import"\r
						class="lm-margin-lg-t">\r
						<lm-admin-import></lm-admin-import>\r
					</div>\r
					<div\r
						*ngIf="openedPages.get(AdminPages.Export)"\r
						[class.lm-display-none]="showPage !== AdminPages.Export"\r
						class="lm-margin-lg-t">\r
						<lm-admin-export></lm-admin-export>\r
					</div>\r
					<div\r
						[class.lm-display-none]="showPage !== AdminPages.BulkDelete"\r
						class="lm-margin-lg-t">\r
						<lm-admin-bulk-delete\r
							(onGoToExport)="changeTab($event)"></lm-admin-bulk-delete>\r
					</div>\r
				</div>\r
			</div>\r
			<div\r
				*ngIf="openedPages.get(AdminPages.DynamicPages)"\r
				[class.lm-display-none]="showPage !== AdminPages.DynamicPages">\r
				<lm-admin-dynamic-pages\r
					[expressionFilter]="expressionFilter"\r
					(onGoToSettings)="changeTab($event)"></lm-admin-dynamic-pages>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var zr=`:host-context(.lm-theme-light) header button,:host-context(.lm-theme-contrast) header button{color:#fff!important}:host-context(.lm-theme-light) header button ::ng-deep svg,:host-context(.lm-theme-contrast) header button ::ng-deep svg{color:#fff!important}:host-context(.lm-theme-light) header [soho-page-title],:host-context(.lm-theme-light) header [soho-section-title],:host-context(.lm-theme-light) header h1,:host-context(.lm-theme-contrast) header [soho-page-title],:host-context(.lm-theme-contrast) header [soho-section-title],:host-context(.lm-theme-contrast) header h1{color:#fff!important}:host-context(.lm-theme-light) header .separator,:host-context(.lm-theme-contrast) header .separator{background-color:#fff!important}.lm-admin-header{background-color:#414247}.lm-admin-header>.toolbar{z-index:2}.lm-admin-app-menu-header{height:60px;padding-left:20px;padding-top:8px;cursor:default}.lm-admin-app-menu-header>.lm-admin-app-menu-header-text{color:#fff}.lm-admin-app-menu-header>h2{font-size:11px}.lm-admin-container{max-height:calc(100% - 60px);width:100%}.lm-admin-dyn-editor-opened{margin-top:60px!important;max-height:calc(100% - 120px);position:relative}[soho-application-menu]>.accordion{flex:0 0 auto}:host ::ng-deep .lm-admin-container .datagrid .lm-admin-error-description svg{top:0!important}:host ::ng-deep .lm-admin-container .datagrid .lm-admin-error-description span{position:relative;top:3px}:host ::ng-deep .lm-admin-base-font-size{font-size:10px;white-space:pre-line}:host ::ng-deep .lm-admin-quota-message{float:left;padding-top:10px}:host ::ng-deep .lm-admin-quota-message>svg{float:left;margin-top:-8px;margin-right:5px}:host ::ng-deep soho-toolbar-flex-section.title>svg{top:0;vertical-align:middle}::ng-deep #lm-a-more-btn{margin-right:0;margin-top:10px;margin-bottom:10px;float:right}::ng-deep .lm-admin-upload-dialog #message-text{white-space:pre-line}::ng-deep #lm-adm-pp-perm-mdl{max-width:550px}::ng-deep #lm-admin-tags-mdl{width:400px}::ng-deep #dyn-p-settings-mdl{width:450px}::ng-deep #dyn-p-archive-mdl{width:350px}
/*# sourceMappingURL=admin-container.css.map */
`;var Wr=`\uFEFF<div\r
	soho-busyindicator\r
	[transparentOverlay]="false"\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isImporting">\r
	<div class="field lm-margin-md-t">\r
		<label [attr.for]="uploadName">Choose File</label>\r
		<input\r
			soho-fileupload\r
			name="{{ uploadName }}"\r
			(change)="onSelectionChange($event)"\r
			accept="{{ acceptFileExtension }}" />\r
	</div>\r
\r
	<fieldset *ngIf="showStrategySelector" class="radio-group">\r
		<input\r
			type="radio"\r
			class="radio"\r
			name="options"\r
			id="adminImportOverwrite"\r
			[(ngModel)]="selectedImportStrategy"\r
			value="0"\r
			checked />\r
		<label for="adminImportOverwrite" class="radio-label"\r
			>Overwrite existing</label\r
		>\r
		<br />\r
		<input\r
			type="radio"\r
			class="radio"\r
			name="options"\r
			id="adminImportPreserve"\r
			[(ngModel)]="selectedImportStrategy"\r
			value="1" />\r
		<label for="adminImportPreserve" class="radio-label"\r
			>Preserve existing</label\r
		>\r
	</fieldset>\r
	<fieldset *ngIf="disclaimer">\r
		<div class="lm-info-text-md lm-import-disclaimer">\r
			<svg soho-icon icon="alert" [alert]="true"></svg>\r
			<span>{{ disclaimer }}</span>\r
		</div>\r
		<div class="field">\r
			<input\r
				id="lm-a-im-d"\r
				class="checkbox"\r
				type="checkbox"\r
				[(ngModel)]="acceptedDisclaimer" />\r
			<label class="checkbox-label" for="lm-a-im-d">{{\r
				agreeOnDisclaimer\r
			}}</label>\r
		</div>\r
	</fieldset>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			(click)="close()"\r
			[disabled]="isImporting"\r
			name="lm-a-import-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			(click)="importFiles()"\r
			[disabled]="\r
				!isValidFile || isImporting || (disclaimer && !acceptedDisclaimer)\r
			"\r
			name="lm-a-import-dialog-ok">\r
			{{ buttonText }}\r
		</button>\r
	</div>\r
</div>\r
`;var Gr=`.lm-import-disclaimer{display:flex;margin-bottom:10px;max-width:600px}.lm-import-disclaimer svg{min-width:22px;top:0}.lm-import-disclaimer span{margin-left:5px}input.checkbox{height:0}
/*# sourceMappingURL=import-dialog.css.map */
`;var Vr=`\uFEFF<div\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[activated]="isBusy"\r
	[displayDelay]="0">\r
	<div class="field">\r
		<label class="label" for="autocomplete-change-owner"\r
			>Select new owner</label\r
		>\r
		<div class="searchfield-wrapper">\r
			<input\r
				soho-autocomplete\r
				maxlength="64"\r
				type="text"\r
				[autoSelectFirstItem]="true"\r
				id="autocomplete-change-owner"\r
				[attributes]="{ name: 'name', value: 'lm-a-change-owner-search' }"\r
				class="lm-autocomplete-searchfield"\r
				placeholder="Search for user..."\r
				(selected)="\r
					!$event[1].hasClass('no-results') ? selectUser($event[2]) : null\r
				"\r
				[source]="autocompleteSource"\r
				[template]="autocompleteTemplate" />\r
			<svg class="icon" focusable="false" role="presentation">\r
				<use xlink:href="#icon-search"></use>\r
			</svg>\r
		</div>\r
	</div>\r
\r
	<!-- Modal buttons -->\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal"\r
			[disabled]="isBusy"\r
			(click)="close()"\r
			id="lm-a-changeowner-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			class="btn-modal-primary"\r
			[disabled]="!selectedOwner || isBusy"\r
			(click)="onOk()"\r
			id="lm-a-changeowner-dialog-ok">\r
			OK\r
		</button>\r
	</div>\r
</div>\r
`;var _r=`<label for="autocomplete-user-search">{{ labelText }}</label>\r
<div class="searchfield-wrapper">\r
	<input\r
		soho-autocomplete\r
		[autoSelectFirstItem]="true"\r
		class="lm-autocomplete-searchfield"\r
		id="autocomplete-user-search"\r
		[attributes]="{ name: 'name', value: 'lm-a-user-search' }"\r
		placeholder="Search for a user..."\r
		maxlength="254"\r
		[(ngModel)]="searchQuery"\r
		[class.lm-clearable]="searchQuery"\r
		(selected)="onUserSelect($event)"\r
		[source]="autocompleteSource"\r
		[template]="autocompleteTemplate" />\r
	<svg soho-icon icon="search"></svg>\r
	<svg\r
		soho-icon\r
		icon="close"\r
		class="close"\r
		(click)="clearSearch()"\r
		*ngIf="searchQuery"></svg>\r
</div>\r
`;var Zr=`<lm-user-search\r
	#searchComponent\r
	(selected)="onSelected($event, true)"\r
	(cleared)="onCleared()"\r
	[labelText]="searchLabelText"></lm-user-search>\r
<div *ngIf="recentSearches && recentSearches.length > 0">\r
	<label *ngIf="recentLabelText" for="recent-user-searches">{{\r
		recentLabelText\r
	}}</label>\r
	<soho-listview\r
		#listView\r
		id="recent-user-searches"\r
		[dataset]="recentSearches"\r
		selectable="single">\r
		<li\r
			soho-listview-item\r
			*ngFor="let item of recentSearches"\r
			(click)="onSelected(item, false)">\r
			<p soho-listview-header>{{ item.displayName }}</p>\r
			<p soho-listview-subheader>{{ item.email }}</p>\r
		</li>\r
	</soho-listview>\r
</div>\r
<div class="modal-buttonset">\r
	<button\r
		class="btn-modal"\r
		(click)="close()"\r
		id="lm-a-usersearch-dialog-cancel">\r
		Cancel\r
	</button>\r
	<button\r
		class="btn-modal-primary"\r
		[disabled]="!selectedUser"\r
		(click)="closeWithSelected()"\r
		id="lm-a-usersearch-dialog-ok">\r
		OK\r
	</button>\r
</div>\r
`;var jr=`soho-listview{max-width:300px}soho-listview li{max-width:300px;padding:5px 8px}soho-listview p{max-width:inherit}
/*# sourceMappingURL=user-search-dialog.css.map */
`;var Yr=`<div *ngIf="statusMessageList?.length > 0">\r
	<ul>\r
		<li\r
			*ngFor="let item of statusMessageList; let first = first; let last = last"\r
			[class.lm-fg]="isStatusMessage(item)"\r
			[ngClass]="{ 'separator lm-brd': !first && last && isLastMessage() }">\r
			<svg\r
				soho-icon\r
				*ngIf="hasIcon(item.severity)"\r
				icon="{{ getIcon(item.severity) }}"\r
				[alert]="true"></svg>\r
			<span> {{ item.message }} </span>\r
		</li>\r
	</ul>\r
</div>\r
<div *ngIf="errorMessageList?.length > 0">\r
	<ul>\r
		<li\r
			*ngFor="let item of errorMessageList; let first = first; let last = last"\r
			[class.statusMessage]="isStatusMessage(item)"\r
			[class.separator]="!first && last && isCompleted">\r
			<svg\r
				soho-icon\r
				*ngIf="isStatusMessage(item)"\r
				icon="{{ getIcon(item.severity) }}"\r
				[alert]="true"></svg>\r
			<span> {{ item.message }} </span>\r
		</li>\r
	</ul>\r
</div>\r
`;var gn=`:host>div{max-width:420px}li{font-size:14px;margin-bottom:10px;display:flex}li svg{top:0;margin-right:5px;flex:0 0 auto}li span{line-height:18px;flex:1 1 auto}.separator{border-top:1px solid;padding-top:10px}
/*# sourceMappingURL=operation-message-list.css.map */
`;var $r=`<lm-operation-messages\r
	[statusMessageList]="statusMessageList"\r
	[errorMessageList]="errorMessageList"\r
	[isCompleted]="isOperationComplete"></lm-operation-messages>\r
<div class="modal-buttonset">\r
	<button\r
		type="button"\r
		class="btn-modal"\r
		(click)="close()"\r
		[disabled]="!isOperationComplete"\r
		id="lm-a-op-message-dialog-close">\r
		Close\r
	</button>\r
</div>\r
`;var Hr=`<ul>\r
	<li>\r
		<svg soho-icon icon="info" [alert]="true"></svg>\r
		<span class="lm-fg"> {{ progressMessage }} </span>\r
	</li>\r
	<li class="separator"></li>\r
	<li *ngIf="successful">\r
		<svg soho-icon icon="success" [alert]="true"></svg>\r
		<span class="lm-fg"> {{ successfulMessage }} </span>\r
	</li>\r
	<li *ngIf="failed">\r
		<svg soho-icon icon="error" [alert]="true"></svg>\r
		<span class="lm-fg"> {{ failedMessage }} </span>\r
	</li>\r
	<li *ngIf="failedDetails">\r
		<span class="lm-fg"> {{ failedDetails }} </span>\r
	</li>\r
	<li *ngIf="skipped">\r
		<svg soho-icon icon="alert" [alert]="true"></svg>\r
		<span class="lm-fg"> {{ skippedMessage }} </span>\r
	</li>\r
</ul>\r
<button\r
	class="btn-secondary lm-margin-md-t"\r
	[disabled]="isComplete || isOperationCancelled()"\r
	(click)="cancelOperation()"\r
	id="lm-a-mm-op-dialog-cancel">\r
	Cancel operation\r
</button>\r
<div class="modal-buttonset">\r
	<button\r
		type="button"\r
		class="btn-modal"\r
		(click)="close()"\r
		[disabled]="!(isComplete || isOperationCancelled())"\r
		id="lm-a-mm-op-dialog-close">\r
		Close\r
	</button>\r
</div>\r
`;var qr=`\uFEFF<div\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy">\r
	<lm-entity-access-component\r
		[options]="accessOptions"\r
		[isAdmin]="true"></lm-entity-access-component>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			[disabled]="isBusy"\r
			(click)="close()"\r
			name="lm-a-eacc-permissions-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			[disabled]="isBusy"\r
			(click)="save()"\r
			name="lm-a-eacc-permissions-save">\r
			Save\r
		</button>\r
	</div>\r
</div>\r
`;var pa,Lt=(pa=class extends J{constructor(e){super("EntityAccessDialogComponent"),this.adminService=e}ngOnInit(){let e=this.parameter,t=e.access;e.access=t?v.copy(t):[],this.accessOptions=e,this.initModalDialog()}save(){let e=this.accessOptions;if(e.access){this.setBusy(!0),this.setCanClose(!1);let t=this;this.isWidget?this.adminService.updateWidgetAccess({id:e.entityId,accessList:e.access}).subscribe(i=>{t.closeWithResult(C.Ok,i)},i=>{t.adminService.handleError(i),t.setBusy(!1),t.setCanClose(!0)}):this.adminService.updatePageAccess({pageId:e.entityId,access:e.access}).subscribe(i=>{t.closeWithResult(C.Ok,i)},i=>{t.adminService.handleError(i),t.setBusy(!1),t.setCanClose(!0)})}}},pa.ctorParameters=()=>[{type:y}],pa);Lt=d([p({template:qr})],Lt);var Qr=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex *ngIf="showToolbar">\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
			{{ title }}\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="a-ps-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button soho-menu-button menu="lmAdminPageSelectorFilter">\r
				<span>{{ orderBy.name }}</span>\r
			</button>\r
			<ul soho-popupmenu id="lmAdminPageSelectorFilter" class="is-selectable">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-ps-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div\r
		#pageSelectorDatagrid\r
		id="gridPageSelector"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"\r
		(expandrow)="onExpandRow($event)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p id="lm-a-ps-showcounttext">{{ getItemCountText() }}</p>\r
		<p\r
			class="lm-margin-sm-t"\r
			*ngIf="isMultiSelect"\r
			id="lm-a-ps-selectedpages-text">\r
			Number of selected pages: {{ selectionCount }}\r
		</p>\r
		<p\r
			class="lm-margin-sm-t"\r
			*ngIf="!isMultiSelect && selected"\r
			id="lm-a-ps-selectedpage-text">\r
			Selected page: {{ selected?.data?.title }}\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		*ngIf="items.length"\r
		type="button"\r
		(click)="more()"\r
		[disabled]="!hasMore">\r
		More\r
	</button>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			[disabled]="isBusy"\r
			(click)="close()"\r
			id="lm-a-pageselect-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			[disabled]="!hasSelection() || isBusy"\r
			(click)="add()"\r
			id="lm-a-pageselect-dialog-add">\r
			{{ defaultButtonText }}\r
		</button>\r
	</div>\r
</div>\r
`;var Jr=`\uFEFF<div>\r
	<div class="row">\r
		<div class="field">\r
			<label for="adm-us-acf" class="e2e-ra-add-lbl">Search for a user</label>\r
			<div class="searchfield-wrapper">\r
				<input\r
					soho-autocomplete\r
					maxlength="254"\r
					id="adm-us-acf"\r
					[autoSelectFirstItem]="true"\r
					[attributes]="{ name: 'name', value: 'lm-a-selectuser-search' }"\r
					class="lm-autocomplete-searchfield e2e-ra-add-input"\r
					[(ngModel)]="searchStringGroup"\r
					[source]="autocompleteSource"\r
					[template]="autocompleteTemplate"\r
					(selected)="\r
						!$event[1].hasClass('no-results') ? selectUser($event[2]) : null\r
					" />\r
				<svg class="icon" focusable="false" role="presentation">\r
					<use xlink:href="#icon-search"></use>\r
				</svg>\r
			</div>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			(click)="dialog?.close()"\r
			id="lm-a-selectuser-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			[disabled]="!selectedUser"\r
			(click)="save()"\r
			id="lm-a-selectuser-dialog-ok">\r
			OK\r
		</button>\r
	</div>\r
</div>\r
`;var ha,$t=(ha=class{constructor(e){this.commonDataService=e,this.initAutocomplete()}selectUser(e){this.selectedUser=e&&e.value?e:null}save(){this.dialog.close({value:this.selectedUser})}initAutocomplete(){let e=this;this.autocompleteSource=new st(t=>e.commonDataService.searchEntity(we.User,t),t=>u.sortByProperty(t,"label"),e.commonDataService).source,this.autocompleteTemplate=Re.autocompleteEntity}},ha.ctorParameters=()=>[{type:xe}],ha);$t=d([p({template:Jr})],$t);var ua,q=(ua=class extends R{get orderByKey(){return this.className+"OrderBy"}get filterKey(){return this.className+"Filter"}get browserStorageService(){return this.adminService.browserStorageService}constructor(e,t,i,s,a,o,n,r){super(e,i,s),this.entityName=t,this.adminService=a,this.sohoDialogService=o,this.ngZone=n,this.options=r,this.items=[],this.selectionCount=0,this.toolbarDisabled=!0,this.hasMore=!1,this.initializing=!0,this.filter={type:0},this.toolbarOptions={maxVisibleButtons:5,rightAligned:!0},this.isReadOnly=!1;let l=[{order:tt.Ascending,entity:it.Title,name:"Title A-Z"},{order:tt.Descending,entity:it.Title,name:"Title Z-A"},{order:tt.Descending,entity:it.ChangeDate,name:"Newest"},{order:tt.Ascending,entity:it.ChangeDate,name:"Oldest"}];if(r&&(r.sortUsedBy&&(l.push({order:tt.Descending,entity:it.UsedBy,name:"Most used"}),l.push({order:tt.Ascending,entity:it.UsedBy,name:"Least used"})),r.sortPriority&&(l.push({order:tt.Descending,entity:it.Priority,name:"High priority"}),l.push({order:tt.Ascending,entity:it.Priority,name:"Low priority"})),r.isFilter)){let c=H,g=[{name:"None",selected:!0,type:c.None}];r.isUserFilter!==!1&&(g.push({name:"Changed by me",type:c.ChangedByMe}),r.isOtherUserFilter!==!1&&g.push({name:"Changed by user...",isUser:!0,type:c.ChangedByUser}),r.isOwnerFilter!==!1&&(g.push({name:"Owned by me",type:c.OwnedByMe}),g.push({name:"Owned by user...",isUser:!0,type:c.OwnedByUser}))),r.isRestrictionFilter!==!1&&(g.push({name:"No restrictions",type:c.NoRestrictions}),g.push({name:"Restrictions",type:c.Restrictions})),r.filters&&(g=g.concat(r.filters)),this.filterItems=g,this.setDefaultFilter()}this.orderByItems=l,this.setDefaultOrderBy(),this.pageSize=M.gridPageSize}setBusy(e){this.isBusy=e,e||(this.initializing=!1)}isEmpty(){return this.items.length===0&&!this.initializing&&!this.isBusy}onError(e){this.adminService.handleError(e),this.setBusy(!1)}getItemCountText(){return E.getItemCountText(this.entityName,this.items.length)}refresh(){this.clearSelection(),this.listItems(!0)}listItems(e){}hasActiveFilters(){return this.isSearchActive||this.filter&&this.filter.type>0}more(){this.listItems(!1)}hasSelection(){let e=this.selection;return e&&e.length>0}getSelectedItem(){let e=this.selection;return e&&e.length>0?e[0].data:null}getSelectedItems(){let e=[],t=this.selection;if(t)for(let i of t)e.push(i.data);return e}clearSelection(){try{let e=this.getDataGrid();e&&e.datagrid&&(e.unSelectAllRows(),this.updateSelection([]))}catch(e){this.logError("Failed to clear selection",e)}}selectItem(e){this.setSelection([{data:e}])}updateSelection(e){this.isBusy||this.setSelection(e)}setOrderBy(e){e&&this.orderBy!==e&&(this.orderBy=e,this.saveOrderBy(e),this.refresh())}search(){let e=(this.query||"").trim();this.query=e;let t=!!e;if(!t&&this.isSearchActive){this.clearSearch();return}if(t){this.isSearchActive=!0,this.activeQuery=e,this.paging=null,this.refresh();return}}clearSearch(e=!0){this.ngZone.run(()=>{this.isSearchActive&&(this.setDefaultSearch(),e&&this.refresh())})}clearAllFilters(){this.clearAllFiltersOptional(!0)}clearAllFiltersOptional(e){this.deleteValue(this.filterKey),this.setDefaultSearch(),this.setDefaultOrderBy(),this.setDefaultFilter(),e&&this.clearCustomFilter(),this.refresh()}getQuery(){return this.query?this.query.trim():""}onFilter(e,t,i){let s=this.filter,a=e.type;if(s.type===a){let o=e.name.indexOf("..")>0,n=a===H.Custom&&(s.propertyName!==e.propertyName||s.value!==e.value);if(!o&&!n)return}if(this.isUserFilter(e)){this.selectFilterUser(e,t,i);return}this.filterUser=null,this.applyFilter(e)}selectFilterUser(e,t,i){let s=this.sohoDialogService.modal($t,t).id("lm-a-selectuser-dialog").title("Select user").afterClose(a=>{a&&a.value?(this.filterUser=a.value,this.applyFilter(e)):i&&setTimeout(()=>{this.restoreFilterSelection(i)},10)});s.apply(a=>{a.dialog=s}).open()}restoreFilterSelection(e){let t="is-checked",i=$(e.target).parent().parent();i.find("."+t).removeClass(t);let s=this.filter.name;i.find("a").filter((a,o)=>$(o).text()===s).parent().addClass(t)}setRequestFilters(e){let t=this.getFilterUser(),i=this.filter,s=H,a=i?i.type:s.None;a===s.ChangedByMe||a===s.ChangedByUser?e.changedById=t:a===s.OwnedByMe||a===s.OwnedByUser?e.ownerId=t:a===s.Restrictions?e.permissionFilter=_n.Restrictions:a===s.NoRestrictions?e.permissionFilter=_n.NoRestrictions:a===s.Custom&&(e[i.propertyName]=i.isUser?t:i.value)}getErrorMessageTemplate(e){return`<div class="lm-margin-lg-t lm-admin-error-description">${e}</div>`}getLinkTemplate(e){return`<a class="lm-margin-lg-t hyperlink" name="lm-help-URL" href="${e}" target="_blank" soho-tooltip [title]="${e}">Help</a>`}hasReplacementTemplate(e){if(e){let t=e.indexOf("{"),i=e.indexOf("}");return t===-1||i===-1?!1:t<i}else return!1}onSearchfieldFocus(){this.activeQuery=this.getQuery()}onSearchfieldFocusLost(){this.query=this.activeQuery}escape(e){return oe.escapeStringForHtml(e)}saveValue(e,t){this.browserStorageService.setLocalStorageItem(e,t)}loadValue(e){return this.browserStorageService.getLocalStorageItem(e)}deleteValue(e){this.browserStorageService.deleteLocalStorageItem(e)}addItems(e,t){this.paging=t,this.hasMore=e.length>=this.pageSize;let i=this.items.length>0,s=this.items.concat(e);this.toolbarDisabled=!s.length&&!this.hasActiveFilters(),this.items=s,i&&this.appendItems(e),this.updateGridData()}updateItems(e){this.items=e,this.updateGridData()}appendItems(e){let t=this.getDataGrid();if(t)for(let i of e)t.addRow(i,"bottom")}getDataGrid(){return null}getColumns(){return null}getSelectionColumn(){return{width:50,id:"selectionCheckbox",field:"",name:"",resizable:!1,sortable:!1,formatter:Formatters.SelectionCheckbox,align:"center"}}getEmptyMessage(){return null}getRowTemplate(){return null}updateGridData(){this.datagridOptions.dataset=this.items}createRequest(e){if(this.isBusy)return null;e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection()),this.getQuery()&&(this.isSearchActive=!0);let t=this.orderBy,i={paging:this.paging,pageSize:this.pageSize,sortOrder:t.order,sortBy:t.entity,query:this.query};return this.setRequestFilters(i),i}withBusy(e){return this.setBusy(!0),e.pipe(rt(()=>{this.setBusy(!1)}))}clearCustomFilter(){}updateCount(e,t){this.count=e=e||0,this.maxCount=t=t||0,t>0&&(this.isCloseToMaxQuota=e/t>=.9,this.isMaxQuota=e>=t);let i=E.pluralize(this.entityName,e);this.toolbarTitle=`You have ${e} of maximally ${t} ${i}.`,this.quotaTitle=this.isMaxQuota?`You have reached your max allowed quota of ${i}!`:`You are near your max allowed quota of ${i}!`}defaultOptions(){let e={selectable:"multiple",expandableRow:!0,disableRowDeactivation:!0,clickToSelect:!1,dataset:[],showNewRowIndicator:!1},t=this.getColumns();t&&(e.columns=t);let i=this.getEmptyMessage();i&&(e.emptyMessage={title:i,icon:I.adminEmptyDatagridIcon});let s=this.getRowTemplate();return s&&(e.rowTemplate=s),e}getFilterUser(){return this.filterUser?this.filterUser.value:this.currentUser}saveOrderBy(e){this.saveValue(this.orderByKey,e)}loadOrderBy(){let e=this.loadValue(this.orderByKey);return e?this.orderByItems.find(t=>t.entity===e.entity&&t.order===e.order):null}saveFilter(e){e.isUser?this.deleteValue(this.filterKey):this.saveValue(this.filterKey,e)}loadFilter(){let e=this.loadValue(this.filterKey);return e?this.findFilter(e.type,e.value):null}setSelection(e){let t=e.length;this.selectionCount=t,this.selection=e,this.selected=e&&t===1?e[0].data:null}isUserFilter(e){let t=H;return e.isUser||e.type===t.OwnedByUser||e.type===t.ChangedByUser}applyFilter(e){let t=this.filter;t&&(t.selected=!1),e.selected=!0,this.setFilter(e),this.saveFilter(e),this.refresh()}setDefaultOrderBy(){this.orderBy=this.loadOrderBy()||this.orderByItems[0]}setDefaultFilter(){if(this.filterItems){let e=this.loadFilter()||this.findFilter(H.None);this.filterItems.forEach(t=>t.selected=!1),e.selected=!0,this.filterUser=null,this.setFilter(e)}}setFilter(e){this.filter=e,this.isFiltered=e.type>0,this.filterTooltip=this.isFiltered?"Filter active":null}findFilter(e,t){return this.filterItems?this.filterItems.find(i=>i.type===e?i.type===H.Custom?i.value===t:!0:!1):null}setDefaultSearch(){this.isSearchActive=!1,this.paging=null,this.query="",this.activeQuery=""}},ua.ctorParameters=()=>[{type:String},{type:String},{type:b},{type:L},{type:y},{type:w},{type:B},{type:void 0}],ua);q=d([Ue()],q);var Ri,Ht=(Ri=class extends q{constructor(e,t,i,s,a){super("AdminPageSelectorComponent","page",e,t,i,s,a),this.isMultiSelect=!1,this.includePublished=!0,this.includeStandard=!0,this.canClose=!0}ngOnInit(){this.pageSize=M.gridPageSize,this.dialog.beforeClose(()=>this.canClose),this.dialog.afterOpen(()=>{this.showToolbar=!0,setTimeout(()=>$("#a-ps-searchfield").focus(),1)});let e=this.pageSelectorOptions;if(e){this.isMultiSelect=e.isMultiSelect||!1,this.title=e.title||"";let t=e.selectedPages||[];t.length&&this.updateSelection(t.map(i=>({data:i}))),this.noShow=e.noShowIds||[],this.includePublished=e.includePublished!==!1,this.includeStandard=e.includeStandard!==!1,this.excludeDynamic=e.excludeDynamic,this.defaultButtonText=e.defaultButtonText||"Add"}this.initGrid(),le.refreshSvgIcons($("#admin-page-selector-sort")),this.refresh()}getDataGrid(){return this.dataGrid}listItems(e){if(this.isBusy)return;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let t=this.orderBy,i={paging:this.paging,pageSize:this.pageSize,sortOrder:t.order,sortBy:t.entity,query:this.query,includePublished:this.includePublished,includeStandard:this.includeStandard};this.excludeDynamic&&(i.excludeDynamic=!0),v.isGuid(i.query)&&(i.entityId=i.query,i.query=null,i.includeStandard=!1);let s=this;this.adminService.listPages(i).subscribe(a=>{let o=a.content;o.forEach(r=>{r.data.escapedTitle=oe.escapeStringForHtml(r.data.title)}),s.addItems(o,a.paging);let n=this.getSelectedItems();n.length&&this.selectPageRows(n),s.setBusy(!1)},a=>{s.setBusy(!1),s.onError(a)})}close(){this.dialog.close({button:C.Cancel})}add(){let e=this.selection.map(i=>i.data),t=this;this.callback?(this.setBusy(!0),this.canClose=!1,this.callback(e).subscribe(()=>{this.canClose=!0,t.dialog.close({button:C.Ok})},()=>{this.setBusy(!1),this.canClose=!0})):t.dialog.close({button:C.Ok,value:e})}onExpandRow(e){let t=e.item,i=t.data,s=$(e.detail).find(".datagrid-row-detail-padding").empty(),a=`<div class="datagrid-cell-layout"><span class="datagrid-textarea lm-white-space-normal">${this.escape(i.description)}</span>`;t.err&&t.err.pageError===_t.DynamicPagesFeatureOff&&(a+=this.getErrorMessageTemplate(fe.formatAlert(I.dynPageFeatureOffMsg,!0))),a+="</div>",$(s).append($(a))}getColumns(){let e=(t,i,s,a,o)=>!u.contains(this.noShow,o.data.id);return[this.getSelectionColumn(),{width:350,id:"adm-ps-col-t",field:"data.escapedTitle",name:"Title",resizable:!0,filterType:"text",sortable:!1,formatter:S.dynamicDisabledExpander},{width:250,id:"adm-ps-col-cd",field:"data.changeDate",name:"Change date",resizable:!0,sortable:!1,formatter:S.date},{width:250,id:"adm-ps-col-cbn",field:"data.changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName}]}selectPageRows(e){let t=this.items.map(s=>s.data),i;for(let s of e)i=u.indexByProperty(t,"id",s.data.id),i!==-1&&this.dataGrid.selectRow(i)}initGrid(){let e=this.defaultOptions();e.selectable=this.isMultiSelect?"multiple":"single",e.rowHeight="medium",this.datagridOptions=e}},Ri.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B}],Ri.propDecorators={dataGrid:[{type:f,args:["pageSelectorDatagrid",{static:!1}]}],dialog:[{type:h}],pageSelectorOptions:[{type:h}]},Ri);Ht=d([p({selector:"lm-admin-page-selector",template:Qr})],Ht);var ga=class ga{};ga.updateRules="updateRules",ga.importData="import",ga.exportData="export";var bn=ga,j=class j{};j.gridPageSize=15,j.checkStatusInterval=2e3,j.parameterIncludeSettings="includesettings",j.parameterIncludeUserSettings="includeusersettings",j.parameterIncludeSettingsRules="includesettingsrules",j.parameterIncludeProperties="includeproperties",j.parameterIncludePrivatePages="includeprivatepages",j.parameterIncludePublishedPages="includepublishedpages",j.parameterIncludePublishedPageConnections="includepublishedpageconnections",j.parameterIncludePublishedPageAccess="includepublishedpageaccess",j.parameterIncludePublishedWidgets="includepublishedwidgets",j.parameterIncludePublishedWidgetAccess="includepublishedwidgetaccess",j.parameterIncludeStandardWidgetAccess="includestandardwidgetaccess",j.parameterIncludeRoles="includeroles",j.parameterIncludeStandardPageAccess="includestandardpageaccess",j.parameterIncludeMemos="includememos",j.parameterIncludePolicies="includepolicies",j.parameterUserSettingsFilter="usersettingsfilter",j.parameterPublishedWidgetsFilter="publishedwidgetsfilter",j.parameterPublishedPagesFilter="publishedpagesfilter",j.parameterPrivatePagesFilter="privatepagesfilter",j.entityIdKey="EntityId",j.archiveIdKey="ArchiveId",j.pageArea=0,j.pageAreaName="Page",j.widgetArea=1,j.widgetAreaName="Widget",j.commonArea=2,j.commonAreaName="Common",j.featureArea=3,j.featureAreaName="Feature",j.allArea=9,j.allAreaName="All",j.policyInvalidText="This security policy is invalid. Invalid security policies always evaluate as false.",j.policyMissingOrInvalidText="Missing or invalid security policies always evaluate as false.",j.severityNotice=1,j.severityInfo=2,j.severitySuccess=3,j.severityWarning=4,j.severityError=5;var M=j;var He;(function(m){m[m.All=0]="All",m[m.DynamicPages=1]="DynamicPages",m[m.Announcements=2]="Announcements"})(He||(He={}));var Kd=[{id:"Asia/Kabul",name:"Afghanistan Standard Time (Asia/Kabul)"},{id:"America/Anchorage",name:"Alaskan Standard Time (America/Anchorage)"},{id:"Asia/Kuwait",name:"Arab Standard Time (Asia/Kuwait)"},{id:"Asia/Dubai",name:"Arabian Standard Time (Asia/Dubai)"},{id:"Asia/Baghdad",name:"Arabic Standard Time (Asia/Baghdad)"},{id:"America/Argentina/Buenos_Aires",name:"Argentina Standard Time (America/Argentina/Buenos Aires)"},{id:"Asia/Yerevan",name:"Armenian Standard Time (Asia/Yerevan)"},{id:"America/Goose_Bay",name:"Atlantic Standard Time (America/Goose Bay)"},{id:"America/Halifax",name:"Atlantic Standard Time (America/Halifax)"},{id:"Australia/Darwin",name:"Australia Central Standard Time (Australia/Darwin)"},{id:"Australia/Sydney",name:"Australia Eastern Standard Time (Australia/Sydney)"},{id:"Asia/Baku",name:"Azerbaijan Standard Time (Asia/Baku)"},{id:"Atlantic/Azores",name:"Azores Standard Time (Atlantic/Azores)"},{id:"Asia/Dhaka",name:"Bangladesh Standard Time (Asia/Dhaka)"},{id:"Europe/Minsk",name:"Belarus Standard Time (Europe/Minsk)"},{id:"Atlantic/Cape_Verde",name:"Cape Verde Standard Time (Atlantic/Cape Verde)"},{id:"America/Guatemala",name:"Central America Standard Time (America/Guatemala)"},{id:"Australia/Adelaide",name:"Central Australia Standard Time (Australia/Adelaide)"},{id:"America/Campo_Grande",name:"Central Brazilian Standard Time (America/Campo Grande)"},{id:"Pacific/Noumea",name:"Central Pacific Standard Time (Pacific/Noumea)"},{id:"America/Chicago",name:"Central Standard Time (America/Chicago)"},{id:"America/Mexico_City",name:"Central Standard Time (America/Mexico City)"},{id:"Asia/Shanghai",name:"China Standard Time (Asia/Shanghai)"},{id:"America/Sao_Paulo",name:"E. South America Standard Time (America/Sao Paulo)"},{id:"Australia/Brisbane",name:"East Australia Standard Time (Australia/Brisbane)"},{id:"America/Havana",name:"Eastern Standard Time (America/Havana)"},{id:"America/New_York",name:"Eastern Standard Time (America/New York)"},{id:"Asia/Gaza",name:"Egypt Standard Time (Asia/Gaza)"},{id:"Africa/Cairo",name:"Egypt Standard Time(Africa/Cairo)"},{id:"Asia/Yekaterinburg",name:"Ekaterinburg Standard Time (Asia/Yekaterinburg)"},{id:"Pacific/Fiji",name:"Fiji Standard Time (Pacific/Fiji)"},{id:"Europe/Helsinki",name:"FLE Standard Time (Europe/Helsinki)"},{id:"Europe/London",name:"GMT Standard Time (Europe/London)"},{id:"America/Godthab",name:"Greenland Standard Time (America/Godthab)"},{id:"America/Miquelon",name:"Greenland Standard Time (America/Miquelon)"},{id:"Pacific/Honolulu",name:"Hawaiian Standard Time (Pacific/Honolulu)"},{id:"Asia/Kolkata",name:"India Standard Time (Asia/Kolkata)"},{id:"Asia/Tehran",name:"Iran Standard Time (Asia/Tehran)"},{id:"Asia/Jerusalem",name:"Israel Standard Time (Asia/Jerusalem)"},{id:"Asia/Amman",name:"Jordan Standard Time (Asia/Amman)"},{id:"Asia/Kamchatka",name:"Kamchatka Standard Time (Asia/Kamchatka)"},{id:"Asia/Seoul",name:"Korea Standard Time(Asia/Seoul)"},{id:"Asia/Beirut",name:"Middle East Standard Time (Asia/Beirut)"},{id:"America/Montevideo",name:"Montevideo Standard Time (America/Montevideo)"},{id:"America/Denver",name:"Mountain Standard Time (America/Denver)"},{id:"America/Mazatlan",name:"Mountain Standard Time (America/Mazatlan)"},{id:"Asia/Rangoon",name:"Myanmar Standard Time (Asia/Rangoon)"},{id:"Africa/Windhoek",name:"Namibia Standard Time (Africa/Windhoek)"},{id:"Asia/Katmandu",name:"Nepal Standard Time (Asia/Katmandu)"},{id:"Pacific/Auckland",name:"New Zealand Standard Time (Pacific/Auckland)"},{id:"America/St_Johns",name:"Newfoundland Standard Time (America/St Johns)"},{id:"Asia/Irkutsk",name:"North Asia East Standard Time (Asia/Irkutsk)"},{id:"Asia/Krasnoyarsk",name:"North Asia Standard Time (Asia/Krasnoyarsk)"},{id:"Asia/Novosibirsk",name:"North Central Asia Standard Time (Asia/Novosibirsk)"},{id:"Asia/Omsk",name:"North Central Asia Standard Time (Asia/Omsk)"},{id:"America/Santiago",name:"Pacific SA Standard Time (America/Santiago)"},{id:"America/Los_Angeles",name:"Pacific Standard Time (America/Los Angeles)"},{id:"America/Santa_Isabel",name:"Pacific Standard Time (America/Santa Isabel)"},{id:"Asia/Karachi",name:"Pakistan Standard Time (Asia/Karachi)"},{id:"America/Asuncion",name:"Paraguay Standard Time (America/Asuncion)"},{id:"Europe/Moscow",name:"Russian Standard Time (Europe/Moscow)"},{id:"America/Bogota",name:"SA Pacific Standard Time (America/Bogota)"},{id:"America/Santo_Domingo",name:"SA Western Standard Time (America/Santo Domingo)"},{id:"Pacific/Apia",name:"Samoa Standard Time (Pacific/Apia)"},{id:"Asia/Kuala_Lumpur",name:"Singapore Standard Time (Asia/Kuala Lumpur)"},{id:"Africa/Johannesburg",name:"South Africa Standard Time (Africa/Johannesburg)"},{id:"Asia/Jakarta",name:"South East Asia Standard Time (Asia/Jakarta)"},{id:"Asia/Colombo",name:"Sri Lanka Standard Time (Asia/Colombo)"},{id:"Asia/Damascus",name:"Syria Standard Time (Asia/Damascus)"},{id:"Asia/Taipei",name:"Taipei Standard Time(Asia/Taipei)"},{id:"Asia/Tokyo",name:"Tokyo Standard Time (Asia/Tokyo)"},{id:"Pacific/Tongatapu",name:"Tonga Standard Time (Pacific/Tongatapu)"},{id:"America/Phoenix",name:"US Mountain Standard Time (America/Phoenix)"},{id:"UTC",name:"UTC"},{id:"America/Noronha",name:"UTC-02 (America/Noronha)"},{id:"Pacific/Pago_Pago",name:"UTC-11 (Pacific/Pago Pago)"},{id:"Pacific/Majuro",name:"UTC+12 (Pacific/Majuro)"},{id:"Pacific/Tarawa",name:"UTC+12 (Pacific/Tarawa)"},{id:"America/Caracas",name:"Venezuela Standard Time (America/Caracas)"},{id:"Asia/Vladivostok",name:"Vladivostok Standard Time (Asia/Vladivostok)"},{id:"Australia/Perth",name:"West Australia Standard Time (Australia/Perth)"},{id:"Africa/Lagos",name:"Western Central Africa Standard Time (Africa/Lagos)"},{id:"Europe/Berlin",name:"Western Europe Standard Time (Europe/Berlin)"},{id:"Asia/Yakutsk",name:"Yakutsk Standard Time (Asia/Yakutsk)"}],E=class m{static getTimeZones(){return Kd}static isReadOnlyUser(e){return e.isSupportUser&&!e.isPageAdministrator&&!e.isAdministrator}static pluralize(e,t){return t!==1?ue.endsWith(e,"y")?e.substring(0,e.length-1)+"ies":e+"s":e}static getIsoDateString(e){try{let t=Soho.Locale.calendar().dateFormat.short,i=Soho.Locale.parseDate(e,t,!0);return Soho.Locale.formatDate(i,{pattern:"yyyyMMdd"})}catch{return e}}static getLocaleDateStringShort(e){try{let t=Soho.Locale.parseDate(e,"yyyyMMdd",!0);return Soho.Locale.formatDate(t,{date:"short"})}catch{return e}}static toIsoDateTimeLocal(e){let t=e.getTimezoneOffset()*60*1e3,i=e.getTime()-t;return new Date(i).toISOString().slice(0,19)}static getPendingChangeDate(){return"*"}static getItemCountText(e,t){return"Showing "+t+" "+m.pluralize(e,t)+"."}},fa,y=(fa=class extends R{constructor(e,t,i,s,a,o,n,r,l,c){super("AdminService",r,t),this.browserStorageService=e,this.dataService=i,this.containerService=s,this.progressService=a,this.cacheService=o,this.sohoToastService=n,this.dialogService=l,this.publishedPages=null,this.allWidgets=null,this.busy=!1,this.roles=null,this.invalidatedCachesEvent=new jt,this.archiveCreatedEvent=new jt,this.archiveRestoredEvent=new jt,this.policiesImportedEvent=new jt,this.appMenuExpandedEvent=new jt,this.appMenuCollapsedEvent=new jt,this.isRoleRequestPending=!1;let g=o.createCache,P=I;this.standardWidgetsCache=g(P.adminCacheStandardWidgets),this.publishedWidgetsCache=g(P.adminCachePublishedWidgets),this.publishedPagesCache=g(P.adminCachePublishedPages),this.standardPagesCache=g(P.adminCacheStandardPages),this.propertiesCache=g(P.adminCacheProperties),this.privatePagesCache=g(P.adminCachePrivatePages),this.rolesCache=g(P.adminCacheRoles)}getTool(){return this.post("/admin/tool")}updateSettings(e){return this.post("/admin/settings/update",{content:e})}updateSettingRules(e){return this.post("/admin/setting/rule/update",{content:e})}listProperties(e){let t=new Ce;return!this.propertiesCache.isValid||e?this.post("/admin/property/list",{}).subscribe(i=>{this.cacheService.updateCache(this.propertiesCache,i,t)},i=>{this.propertiesCache.isValid=!1,t.error(i)}):this.complete(t,this.propertiesCache.cachedResponse),t.asObservable()}deleteBulk(e){return this.post("/admin/bulk/delete",e)}searchRoles(e){let t=new Ce;return this.getRoles(!1).subscribe(i=>{if(i.content){let s=e.toLowerCase(),a=u.findAll(i.content,n=>{try{if(n&&n.id&&n.id.toLowerCase().indexOf(s)!==-1)return!0}catch(r){Oe.error(this.logPrefix+"Failed to filter "+r)}return!1}),o=[];if(a)for(let n=0;n<10;n++){let r=a[n];if(r){let l={label:r.id||r.name,value:r.id,type:we.Role};r.name&&(l.info=r.name),o.push(l)}}t.next(o),t.complete()}else t.error("No roles found")},i=>{t.error(i)}),t.asObservable()}createProperty(e){return this.post("/admin/property/create",{content:e})}updateProperty(e){return this.post("/admin/property/update",{content:e})}deleteProperty(e){return this.post("/admin/property/delete",{content:e})}exportProperties(e){let t="";if(e)for(let s=0;s<e.length;s++)t+=s===0?"?keys="+e[s].propertyId:"&keys="+e[s].propertyId;let i=this.dataService.getUrl("admin/property/export/"+encodeURI("properties")+".json")+t;this.isDebug()&&this.logDebug("Executing url "+i),window.open(i,"_blank")}exportExpressions(e){let t="";if(e)for(let s of e)t+=(t.length===0?"?":"&")+"keys="+s;let i=this.dataService.getUrl("admin/exp/export/policies.json")+t;window.open(i,"_blank")}listExpressions(e){return this.post("/admin/exp/list",e)}getExpression(e){return this.post("/admin/exp/get",e)}deleteExpression(e){return this.post("/admin/exp/delete",e)}createExpression(e){return this.post("/admin/exp/create",e)}updateExpression(e){return this.post("/admin/exp/update",e)}testExpression(e){return this.post("/admin/exp/test",e)}validateExpressions(e){return this.post("/admin/exp/validate",{content:e})}listArchive(e,t){return this.post(t+"/archive/list",e)}createArchive(e,t){return this.post(t+"/archive/create",e)}deleteArchive(e,t){return this.post(t+"/archive/delete",{content:e})}restoreArchive(e,t){return this.post(t+"/operation/import",{parameters:e})}listPrivatePages(e,t,i){let s=i?"users/count":"list",a=new Ce,o={content:e};return!this.privatePagesCache.isValid||t?this.post(`/admin/page/private/${s}`,o).subscribe(n=>{this.cacheService.updateCache(this.privatePagesCache,n,a)},n=>{this.privatePagesCache.isValid=!1,a.error(n)}):this.complete(a,this.privatePagesCache.cachedResponse),a.asObservable()}listPages(e){return this.post("/admin/page/shared/list",e)}listPublishedPages(e){return e.includePublished=!0,this.listPages(e)}listStandardPages(e){return e.includeStandard=!0,this.listPages(e)}enableStandardPages(e){let t=this.pageToIdArray(e);return this.post("/admin/page/standard/enable",{content:t})}disableStandardPages(e){let t=this.pageToIdArray(e);return this.post("/admin/page/standard/disable",{content:t})}resetStandardPagesAccess(e){let t=this.pageToIdArray(e);return this.post("/admin/page/standard/access/reset",{content:t})}getPageSettingInfo(e){return this.post("/admin/page/settinginfo/get",{content:e})}getPublishedPagesCount(){return this.post("/admin/page/published/count",{})}getPublishedWidgetsCount(){return this.post("/admin/widget/published/count",{})}getTenantWidgetsCount(){return this.post("/admin/widget/tenant/count",{})}deletePrivatePages(e,t){let i=t?"users/delete":"delete",s=t?e[0]:e;return this.post(`/admin/page/private/${i}`,{content:s})}exportPublishedPages(e){this.exportPages(ne.publishedPage,this.pageToIdArray(e))}exportStandardPages(e){this.exportPages(ne.standardPage,this.pageToIdArray(e))}exportPrivatePages(e,t){this.exportPages(ne.privatePage,this.pageToIdArray(t),e)}listTags(e){return this.post("/admin/tag/list",e)}deleteTags(e){return this.post("/admin/tag/delete",e)}updateTags(e){return this.post("/admin/tag/update",e)}listFeatured(e){return this.post("/admin/featured/list",e)}reorderFeatured(e){return this.post("/admin/featured/reorder",e)}removeFeaturedItem(e){return this.dataService.post("/common/entitylist/remove",{content:e})}listPublishedWidgets(e){return e.includePublished=!0,e.includeMobile=!0,e.includeNormal=!0,e.includeBanner=!0,this.listWidgets(e)}listStandardWidgets(e){return e.includeStandard=!0,e.includeMobile=!0,e.includeBanner=!0,e.includeNormal!==!1&&(e.includeNormal=!0),this.listWidgets(e)}listTenantWidgets(e){return this.post("/admin/widget/tenant/list",e)}deleteTenantWidget(e){return this.post("/admin/widget/tenant/delete",{content:e})}exportPublishedWidgets(e){this.exportWidgets(ne.publishedWidget,"widgets",e)}exportStandardWidget(e){let t=[];t.push(e),this.exportWidgets(ne.standardWidget,e.widgetId,t)}exportTenantWidget(e){let t=e.widgetId,i=e.version,s=e.frameworkVersion,a="?id="+encodeURIComponent(t)+"&version="+encodeURIComponent(i)+"&framework="+encodeURIComponent(s),o=this.dataService.getUrl("admin/widget/tenant/export/"+encodeURI(t)+".zip")+a;window.open(o,"_blank")}publishStandardCopy(e){return this.post("/admin/page/standard/publish",{content:e})}publishToExisting(e,t){return this.post("/admin/page/publish/existing",{first:e,second:t})}getWidgetAccess(e){return this.post("/admin/widget/access",{content:e})}updateWidgetAccess(e){return this.post("/admin/widget/access/update",{content:e})}getWidgetDeployInfo(e){return this.post("/admin/widget/deployinfo",{content:e})}getPageAccess(e){return this.post("/admin/page/access",{content:e})}updatePageAccess(e){return this.post("/admin/page/access/update",{content:e})}clearPageAccess(e){let t={pageId:e,access:[]};return this.updatePageAccess(t)}deletePublishedWidget(e){return this.post("/admin/widget/published/delete",{content:e})}openImportFilesDialog(e,t,i=!0){let s=new Ee,a=this.dialogService.modal(Mi,t).id("lm-a-import-dialog").title(e.title).afterClose(o=>{s.next(o),s.complete()});return a.apply(o=>{o.dialog=a,o.options=e,o.uploadFiles=i}).open(),s.asObservable()}startExportOperation(e){return this.post("/admin/operation/export",{parameters:e})}getExportFileInfo(){return this.post("/admin/operation/export/fileinfo",{})}deleteExportFile(){return this.post("/admin/operation/export/delete",{})}startImportOperation(e){return this.post("/admin/operation/import",{parameters:e})}cancelOperation(){return this.post("/admin/operation/cancel",{})}getOperationStatus(){return this.post("/admin/operation/status",{})}getDateRangeStatus(e){return this.post("/admin/daterange/status",{content:e})}validateDateRange(e){return this.post("/admin/daterange/validate",{content:e})}downloadExportFile(){let e=this.dataService.getUrl("admin/operation/export/download/"+encodeURI("LimeExport")+".zip");this.isDebug()&&this.logDebug("Executing url "+e),window.open(e,"_blank")}onCachesInvalidated(){return this.invalidatedCachesEvent}onArchiveCreated(){return this.archiveCreatedEvent}raiseArchiveCreated(){this.archiveCreatedEvent.raise()}onArchiveRestored(){return this.archiveRestoredEvent}raiseArchiveRestored(){this.archiveRestoredEvent.raise()}onPoliciesImported(){return this.policiesImportedEvent}raisePoliciesImported(){this.policiesImportedEvent.raise()}onAppMenuExpanded(){return this.appMenuExpandedEvent}raiseAppMenuExpanded(e){this.appMenuExpandedEvent.raise(e)}onAppMenuCollapsed(){return this.appMenuCollapsedEvent}raiseAppMenuCollapsed(){this.appMenuCollapsedEvent.raise()}invalidateCaches(e){e[M.parameterIncludeProperties]===!0&&(this.propertiesCache.isValid=!1),e[M.parameterIncludePrivatePages]===!0&&(this.privatePagesCache.isValid=!1),e[M.parameterIncludePublishedPages]===!0&&(this.publishedPagesCache.isValid=!1),e[M.parameterIncludePublishedWidgets]===!0&&(this.publishedWidgetsCache.isValid=!1),e[M.parameterIncludeRoles]===!0&&(this.rolesCache.isValid=!1),this.invalidatedCachesEvent.raise(e)}handleError(e,t){let i=cn;if(!t&&e&&e.errorList&&e.errorList[0].code)switch(e.errorList[0].code){case i.requestTimeout:t="The request was cancelled. The respone took too long. Please try and use filter or search.";break;case i.requestLoopTimeout:t="The request was cancelled. There was not enough matches. Please try and use filter or search.";break}this.dataService.handleError(e,t)}showUploadCompleteDialog(e,t,i){let s=i?this.messageService.error:this.messageService.message,a=new Ee,o=[{text:"Ok",id:"lm-a-uploadcomplete-dialog-ok",click:(n,r)=>{r.close(),a.next({button:C.Ok}),a.complete()}}];return s().title(e).attributes({name:"id",value:"lm-a-uploadcomplete-dialog"}).cssClass("lm-admin-upload-dialog").message(oe.escapeStringForHtml(t)).buttons(o).open(),a.asObservable()}updatePageOwner(e){return this.post("/page/owner/update",{content:e})}openChangeOwnerDialog(e,t){let i=this.dialogService.modal(Li,t).title("Change Owner - "+e.title).id("lm-a-changeowner-dialog").afterClose(s=>{s&&s.button===C.Ok&&e.callback()});i.apply(s=>{s.modalDialog=i,s.currentOwnerId=e.currentOwnerId,s.isWidget=e.isWidget,s.itemId=e.itemId}).open()}clearOrReplaceWidgetAccess(e,t,i,s){this.progressService.setBusy(!0);let a=e.length;for(let o of e)this.updateWidgetAccess({id:o.widgetId,accessList:t?s:[]}).subscribe(()=>{a-=1,a===0&&(this.progressService.setBusy(!1),i())},n=>{this.handleError(n),this.progressService.setBusy(!1)})}openEntityAccessDialog(e,t){let i=new Ee,s=this.dialogService.modal(Lt,t).title(oe.escapeStringForHtml(e.title)).id("lm-a-eacc-permissions-dialog").suppressEnterKey(!0).afterClose(a=>{i.next(a),i.complete()});return s.apply(a=>{a.modalDialog=s,a.parameter=e,a.isWidget=!0}).open(),i.asObservable()}openWidgetAccessDialog(e,t,i){let s=e.widgetId,a=xt.widgets(this.languageService,s,e.title,!v.isGuid(s)),o=this.progressService;o.setBusy(!0),this.getWidgetAccess({id:s,accessList:[]}).subscribe(n=>{a.access=n.content.accessList,o.setBusy(!1),this.openEntityAccessDialog(a,i).subscribe(r=>{r&&r.value&&t(r.value)})},n=>{this.handleError(n),o.setBusy(!1)})}applyWidgetAccess(e,t,i){let s=this.progressService,a,o=e.length;s.setBusy(!0);for(let n of e)this.getWidgetAccess({id:n.widgetId,accessList:[]}).subscribe(r=>{a=r.content.accessList;for(let l of t){let c=u.indexByProperty(a,"principal",l.principal);c!==-1?a[c]=l:a.push(l)}this.updateWidgetAccess({id:n.widgetId,accessList:a}).subscribe(()=>{o-=1,o===0&&(s.setBusy(!1),i())},l=>{this.handleError(l),s.setBusy(!1)})},r=>{this.handleError(r),s.setBusy(!1)})}openPageAccessDialog(e,t){let i=this,s=i.progressService,a=e.entityId;s.setBusy(!0);let o=e.title?" - "+oe.escapeStringForHtml(e.title):"";this.getPageAccess(a).subscribe(n=>{if(n.content){e.access=n.content.access,s.setBusy(!1);let r=this.dialogService.modal(Lt,t).title("Page Permissions"+o).id("lm-adm-pp-perm-mdl").suppressEnterKey(!0).afterClose(l=>{l&&e.callback()});r.apply(l=>{l.modalDialog=r,l.parameter=e,l.isWidget=!1}).open()}},n=>{s.setBusy(!1),i.handleError(n)})}applyPageAccess(e,t,i){let s=this.progressService,a,o,n=e.length;s.setBusy(!0);for(let r of e)this.getPageAccess(r.data.id).subscribe(l=>{a=l.content,o=a.access||[];for(let c of t.access){let g=u.indexByPredicate(o,P=>v.isAccess(P,c));g!==-1?(c.operation=pe.Update,o[g]=c):(c.operation=pe.Create,o.push(c))}a.access=o,this.updatePageAccess(a).subscribe(c=>{n-=1,n===0&&(s.setBusy(!1),i())},c=>{this.handleError(c),s.setBusy(!1)})},l=>{this.handleError(l),s.setBusy(!1)})}clearPageAccessPages(e){let t=new Ee;return this.clearPageAccessPagesSingleCallChain(e,e.length,t),t.asObservable()}clearPageAccessPagesSingleCallChain(e,t,i){let s=e.length;if(s===0){this.progressService.setBusy(!1);let o=t===1?"The page access has been cleared.":`The page access has been cleared on ${t} pages`;this.sohoToastService.show(v.getToastOptions("Access cleared",o)),i.complete();return}let a=e.pop();this.clearPageAccess(a).subscribe(o=>{if(o.hasError()){i.error("Clear failed for page "+a),this.showClearAccessFailed(s,t);return}Oe.info("Cleared selection for page with ID "+a),this.clearPageAccessPagesSingleCallChain(e,t,i)},o=>{Oe.error("Failed to clear page access",o),i.error("Clear failed for page "+a+" "+o),this.showClearAccessFailed(s,t)})}replacePageAccess(e,t,i){let s=new Ee;return this.replacePageAccessSingleCallChain(e,t,i,s),s.asObservable()}createPageAccessReplaceInput(e,t){let i=t.access;if(!i||i.length===0){let o=v.copy(e);return o.pageId=t.pageId,o}let s={pageId:t.pageId,access:[]},a=e.access;for(let o=0;o<i.length;o++){let n=i[o],r=u.indexByPredicate(a,c=>v.isAccess(c,n)),l;if(r===-1)l=v.copy(n),l.operation=pe.Delete;else{let c=a[r];l=v.copy(c),l.operation=pe.Update}s.access.push(l)}for(let o=0;o<a.length;o++){let n=a[o];if(!(u.indexByPredicate(s.access,c=>v.isAccess(c,n))!==-1)){let c=v.copy(a[o]);c.operation=pe.Create,s.access.push(c)}}return s}openPageSelectorDialog(e,t,i,s){let a=new Ee,o=this.dialogService.modal(Ht,i).title(t).id("lm-a-pageselect-dialog").afterClose(n=>{a.next(n),a.complete()});return o.apply(n=>{n.dialog=o,n.pageSelectorOptions=e,n.callback=s}).open(),a.asObservable()}openUserSearchDialog(e,t,i,s,a){let o=new Ee,n=this.dialogService.modal(ba,t).title(e).id("lm-a-usersearch-dialog").afterClose(r=>{o.next(r),o.complete()});return n.apply(r=>{r.modalDialog=n,r.searchLabelText=i,r.recentLabelText=s,a&&(r.recentSearches=a)}).open(),o.asObservable()}openImportDialog(e,t,i){let s=new Ee;return this.openImportFilesDialog(e,t,!1).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?setTimeout(()=>{let n=this.dialogService.modal(qt,t).title(e.title).id("lm-a-import-op-message-dialog").afterClose(r=>{r&&r.value&&r.value===Q.Success?(i&&i(),s.next(r),s.complete()):s.error({})});n.apply(r=>{r.modalDialog=n,r.initialMessage="Import started...",r.operation=this.dataService.upload("/admin",e.operation,o.files,o.formFields)}).open()}):(s.next(a),s.complete())},a=>{s.error(a)}),s.asObservable()}openPolicyImportDialog(e){let i={operation:ne.expression.toString(),title:"Import Security Policies",acceptFileExtension:".json",showStrategySelector:!0};return this.openImportDialog(i,e,()=>this.raisePoliciesImported())}unselectGridItem(e,t){return e&&t&&u.containsByProperty(t.selection.getSelectedRows(),"$$hashKey",e.$$hashKey)?(t.selection.toggleRowSelection(e),t.selection.getSelectedRows(),t.selection.getSelectedRows().length):0}getDeletePageOptions(e,t,i){if(i)return this.getDeletePageForUsersOptions(e[0]);let a=e.map(l=>l.data.id).length>1,o=a?"Delete Pages":"Delete Page",n=a?"Are you sure that you want to delete the selected pages?":"Are you sure that you want to delete the page?";return t||(n=n+(a?" They will be deleted for all users.":" It will be deleted for all users.")),{title:o,message:n,standardButtons:dn.YesNo}}getPageDeletedForUsersConfirmationOptions(e,t){let i=t>1?"pages":"page";return{title:"Deleted",message:`Deleted ${t} ${i} with the title '${e}'`,standardButtons:dn.Ok}}setLastVisitedTab(e){this.lastVisitedTab=e,this.containerService.notifyMingle(e)}getLastVisitedTab(){return this.lastVisitedTab}getDeletePageForUsersOptions(e){let t=e.popularity>1?"pages":"page";return{title:"Delete Page",message:`Are you sure that you want to delete all private pages with the title '${e.title}'? ${e.popularity} private ${t} will be deleted.`,standardButtons:dn.YesNo}}complete(e,t){e.next(t),e.complete()}post(e,t,i){return this.dataService.post(e,t,i)}getRoles(e){let t=new Ce,i=this;if(!i.rolesCache.isValid||e){if(this.isRoleRequestPending)return this.lastUsedListSubject.asObservable();this.isRoleRequestPending=!0,this.lastUsedListSubject=t,i.post("/admin/role/list",{}).subscribe(s=>{this.isRoleRequestPending=!1,u.sortByProperty(s.content,"id"),i.cacheService.updateCache(i.rolesCache,s,t)},s=>{this.isRoleRequestPending=!1,i.rolesCache.isValid=!1,t.error(s)})}else t.next(i.rolesCache.cachedResponse),t.complete();return t.asObservable()}exportPages(e,t,i){let s="";if(t)for(let r=0;r<t.length;r++)s+=r===0?"?keys="+t[r]:"&keys="+t[r];let a="published";e===ne.privatePage?a="private":e===ne.standardPage&&(a="standard");let o="admin/page/"+a+"/export/";e===ne.privatePage&&i&&(o=o+i+"/");let n=this.dataService.getUrl(o+encodeURI("pages")+".zip")+s;this.isDebug()&&this.logDebug("Executing url "+n),window.open(n,"_blank")}pageToIdArray(e){if(!e)return null;let t=[];for(let i=0;i<e.length;i++)t.push(e[i].data.id);return t}listWidgets(e){return this.post("/admin/widget/shared/list",e)}exportWidgets(e,t,i){let s=`?cat=${e}`;if(i)for(let o=0;o<i.length;o++){let n=i[o],r=n.widgetId,l=n.standardWidgetId?n.standardWidgetId:"",c=r+":"+l;s+=`&keys=${encodeURI(c)}`}let a=this.dataService.getUrl("admin/widget/export/"+encodeURI(t)+".zip")+s;window.open(a,"_blank")}showClearAccessFailed(e,t){this.progressService.setBusy(!1);let i=t===1,s=t-e,a=i?"The access could not be cleared for the page.":"Unable to complete the operation.";!i&&s>0&&(a=a+" "+s+" of "+t+" pages were cleared. Please re-try the action.");let o=[{text:"Ok",id:"lm-a-clearaccess-message-close",click:(n,r)=>{r.close()}}];this.messageService.error().title("Unable to clear access").message(a).attributes({name:"id",value:"lm-a-clearaccess-message"}).buttons(o).open()}replacePageAccessSingleCallChain(e,t,i,s){let a=t.length;if(a===0){this.progressService.setBusy(!1);let n=i===1?"The page access has been updated.":`The page access has been updated on ${i} pages`;Oe.info(n),s.complete();return}let o=t.pop();this.progressService.setBusy(!0),this.getPageAccess(o).subscribe(n=>{if(n.hasError()){this.showReplaceAccessFailed(a,i),s.error("Get page access failed for "+o);return}let r=this.createPageAccessReplaceInput(e,n.content);return this.updatePageAccess(r).subscribe(l=>{if(l.hasError()){this.showReplaceAccessFailed(a,i),s.error("Update page access failed for "+o);return}this.replacePageAccessSingleCallChain(e,t,i,s)},l=>{Oe.error("Failed to update page access for page "+o,l),this.showReplaceAccessFailed(a,i),s.error("Update page access failed for "+o)}),s},n=>{Oe.error("Failed to get page access (prior to update) for page "+o,n),this.showReplaceAccessFailed(a,i),s.error("Get page access failed for "+o)})}showReplaceAccessFailed(e,t){this.progressService.setBusy(!1);let i=t===1,s=t-e,a=i?"The access could not be changed for the page.":"Unable to complete the operation.";!i&&s>0&&(a=a+" "+s+" of "+t+" pages were updated. Please re-try the action.");let o=[{text:"Ok",id:"lm-a-replaceaccess-message-close",click:(n,r)=>{r.close()}}];this.messageService.error().title("Unable to replace access").message(a).attributes({name:"id",value:"lm-a-replaceaccess-message"}).buttons(o).open()}},fa.ctorParameters=()=>[{type:lt},{type:L},{type:St},{type:Fe},{type:dt},{type:Br},{type:Ie},{type:b},{type:w},{type:xr}],fa);y=d([ye({providedIn:"root"})],y);var ya,O=(ya=class extends R{constructor(e){super("AdminContext"),this.adminService=e,this.toolSubject=new gt(1),Dr.initialize(),this.tool$=this.toolSubject.asObservable()}nextTool(e,t){this.updateFeatureFlags(this.adminTool,!e,t),this.toolSubject.next(this.adminTool)}initialize(e){let t=new Ce;return this.adminService.getTool().subscribe(i=>{this.adminTool=this.initializeAdminTool(i.content),i.content=this.adminTool,t.next(i),t.complete(),this.nextTool(!0,e)},i=>{t.error(i)}),t.asObservable()}get(){return this.adminTool}updateFeatureFlags(e,t,i){let s=e.settings,a=c=>u.find(s,g=>g.settingName===c),o=c=>c?c.value==="true":!1,n=a(K.featureStandardPages),r=a(K.featureDynamicPages),l=a(K.featureTenantWidgets);e.featureBanner=!0,t?(n!=null&&(e.featureStandardPages=o(n)),r!=null&&(e.featureDynamicPages=o(r)),l&&(e.featureTenantWidgets=o(l))):(e.featureStandardPages=o(n),e.featureDynamicPages=o(r),e.featureTenantWidgets=o(l)),i?e.featureGlobalDynamicPages=r!==null:this.adminTool&&(e.featureGlobalDynamicPages=this.adminTool.featureGlobalDynamicPages)}initializeAdminTool(e){let t={settings:e.settings,isAdministrator:!1,isPageAdministrator:!1,isProvisioner:!1,isSupportUser:!1,isCloud:!1,userName:e.userName,userId:e.userId,tenantId:e.tenantId,version:e.version,maxCountPrivatePage:0,maxCountPublishedPage:0,maxCountTenantWidgets:0,maxCountWidget:0,maxCountWidgetsOnPage:0,featureStandardPages:!1,featureBanner:!0,featureTenantWidgets:!1,featureDynamicPages:!1,featureGlobalDynamicPages:!1,isUnsignedTenantWidgetsEnabled:!1},i;for(i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return this.updateFeatureFlags(t,null,!1),t}},ya.ctorParameters=()=>[{type:y}],ya);O=d([ye({providedIn:"root"})],O);var Bi,Mi=(Bi=class extends R{constructor(e){super("AdminImportDialogComponent"),this.dataService=e,this.uploadName="fileUpload",this.selectedImportStrategy="0",this.uploadFiles=!0,this.isValidFile=!1,this.acceptedDisclaimer=!1,this.agreeOnDisclaimer="I have read the disclaimer"}ngOnInit(){if(this.setCanClose(!1),this.options){let e=this.options;this.buttonText=e.buttonText||"Import",this.acceptFileExtension=e.acceptFileExtension||".zip",this.showStrategySelector=e.showStrategySelector,this.disclaimer=e.disclaimer}else this.logError("Missing input")}onSelectionChange(e){let t=e.target.files||[];this.isValidFile=t.length>0&&this.isValidExtension(t[0].name),this.selectedFiles=t}importFiles(){if(!this.isValidFile){this.logDebug("No valid file was selected.");return}if(this.uploadFiles)this.upload(this.selectedFiles);else{let e=this.getFormFields();this.setCanClose(!0),this.dialog.close({button:C.Yes,value:{files:this.selectedFiles,formFields:e,responseCode:Q.Success}})}}close(){this.setCanClose(!0),this.dialog.close({button:C.Cancel})}setCanClose(e){this.dialog.beforeClose(()=>e)}upload(e){let t=this.dialog,i=this.getFormFields();this.isImporting=!0,this.dataService.upload("/admin",this.options.operation,e,i).subscribe(s=>{let a="",o=s.messageList;if(o)for(let n of o)a+=n.message;this.setCanClose(!0),this.isImporting=!1,t.close({button:C.Yes,value:{message:a,responseCode:Q.Success}})},s=>{let a="";if(s.errorList)for(let o of s.errorList)o.code===cn.badRequest?o.message==="The action could not be performed."?a+="Unable to import. Please check that the file has the correct format.":a+=o.message+" ":o.code===cn.unauthorized?a+="Unable to import. You do not have permission to perform this action.":a+=o.message+" ";a===""&&(a="Unable to import. Please check that the file has the correct format."),this.setCanClose(!0),this.isImporting=!1,t.close({button:C.Yes,value:{message:a,responseCode:Q.Fail}})})}getFormFields(){let e=this.options.formFields||{};return this.showStrategySelector&&(e.strategy=this.selectedImportStrategy),e}isValidExtension(e){return e&&e.endsWith(this.acceptFileExtension)}},Bi.ctorParameters=()=>[{type:St}],Bi.propDecorators={busyIndicator:[{type:f,args:[vr,{static:!1}]}],close:[{type:rn,args:["keydown.escape"]}]},Bi);Mi=d([p({template:Wr,styles:[Gr]})],Mi);var va,Li=(va=class extends J{constructor(e,t,i){super("ChangeOwnerComponent"),this.commonDataService=e,this.adminService=t,this.widgetService=i,this.initAutocomplete()}ngOnInit(){this.initModalDialog()}selectUser(e){W.isUndefined(e)&&this.currentOwnerId!==e.value||(this.selectedOwner=e)}onOk(){if(this.currentOwnerId!==this.selectedOwner.value){let e="Owner change failed!";this.setBusy(!0),this.setCanClose(!1);let t=this;this.isWidget?this.widgetService.updatePublishedOwner(this.itemId,this.selectedOwner.value).subscribe(i=>{t.closeWithResult(C.Ok,this.selectedOwner)},i=>{t.adminService.handleError(i,e)}):this.adminService.updatePageOwner({id:this.itemId,ownerId:this.selectedOwner.value}).subscribe(i=>{t.closeWithResult(C.Ok,this.selectedOwner)},i=>{t.adminService.handleError(i,e)})}}initAutocomplete(){let e=this;this.autocompleteSource=(t,i)=>{e.commonDataService.searchUsers(t).subscribe(s=>{u.removeByProperty(s.content,"userName",e.currentOwnerId),i(t,u.sortByProperty(v.getEntityArray(we.User,s.content),"label"))})},this.autocompleteTemplate=Re.autocompleteEntity}},va.ctorParameters=()=>[{type:xe},{type:y},{type:at}],va);Li=d([p({template:Vr})],Li);var Ui,fn=(Ui=class{constructor(e){this.commonDataService=e,this.selected=new V,this.cleared=new V,this.labelText="Search user",this.initAutocomplete()}onUserSelect(e){if(e[2]){let t=e[2];if(W.isUndefined(t)||W.isUndefined(t.value))return;let i={id:t.value,email:t.info,displayName:t.label};this.selected.emit(i)}}clearSearch(){this.searchQuery=null,this.cleared.emit()}initAutocomplete(){this.autocompleteSource=(e,t)=>{this.commonDataService.searchUsers(e).subscribe(i=>{t(e,u.sortByProperty(v.getEntityArray(we.User,i.content),"label"))},i=>{this.commonDataService.handleError(i)})},this.autocompleteTemplate=Re.autocompleteEntity}},Ui.ctorParameters=()=>[{type:xe}],Ui.propDecorators={selected:[{type:U}],cleared:[{type:U}],labelText:[{type:h}]},Ui);fn=d([p({selector:"lm-user-search",template:_r})],fn);var Fi,ba=(Fi=class extends J{constructor(){super("UserSearchDialogComponent"),this.recentSearches=[]}onSelected(e,t){this.listView&&t?this.listView.clearAllSelected():t||(this.searchComponent.searchQuery=null),e===this.selectedUser?this.selectedUser=null:this.selectedUser=e}onCleared(){this.selectedUser=null}closeWithSelected(){this.modalDialog.close(this.selectedUser)}},Fi.ctorParameters=()=>[],Fi.propDecorators={listView:[{type:f,args:["listView",{static:!1}]}],searchComponent:[{type:f,args:["searchComponent",{static:!1}]}]},Fi);ba=d([p({template:Zr,styles:[jr]})],ba);var xa,yn=(xa=class{constructor(){this.isCompleted=!1}hasIcon(e){return e===M.severityInfo||e===M.severitySuccess||e===M.severityWarning||e===M.severityError}getIcon(e){switch(e){case M.severityInfo:return"info";case M.severitySuccess:return"success";case M.severityWarning:return"alert";case M.severityError:return"error";default:return""}}isStatusMessage(e){return e.severity&&e.severity>0}isLastMessage(){return this.isCompleted&&!(this.errorMessageList&&this.errorMessageList.length)}},xa.propDecorators={statusMessageList:[{type:h}],errorMessageList:[{type:h}],isCompleted:[{type:h}]},xa);yn=d([p({selector:"lm-operation-messages",template:Yr,styles:[gn]})],yn);var Sa,qt=(Sa=class extends J{constructor(){super("AdminOperationMessageDialog"),this.statusMessageList=[],this.errorMessageList=[],this.isOperationComplete=!1,this.timeOut=4e3}ngOnInit(){this.initialMessage&&(this.initialMessageInfo={message:this.initialMessage,code:0,isTranslated:!1}),this.initialMessageInfo&&this.statusMessageList.push(this.initialMessageInfo)}ngAfterViewInit(){this.startOperation()}startOperation(){this.operation&&this.operation.subscribe(e=>{e?(this.statusMessageList=e.messageList,this.initialMessageInfo&&this.statusMessageList.unshift(this.initialMessageInfo),this.errorMessageList=e.errorList,e.hasError()?this.responseCode=Q.Fail:this.responseCode=Q.Success):this.responseCode=Q.Fail,this.isOperationComplete=!0},e=>{this.errorMessageList=e.errorList,this.errorMessageList.forEach(t=>{t.severity=M.severityError}),this.responseCode=Q.Fail,this.isOperationComplete=!0})}close(){this.closeWithResult(C.Ok,this.responseCode)}},Sa.ctorParameters=()=>[],Sa);qt=d([p({template:$r})],qt);var Ca,Ct=(Ca=class extends J{constructor(e){super("AdminMultiOperationDialog"),this.detector=e,this.cancelled="false",this.isComplete=!1,this.successful=0,this.failed=0,this.skipped=0}ngAfterViewInit(){let e=this.options.operations;this.operationCount=e?e.length:0,this.nextOperation()}nextOperation(){let e=this.options.operations;this.isComplete=!e||e.length===0,this.updateProgress(),!this.isOperationCancelled()&&!this.isComplete&&e.shift().subscribe(()=>{this.updateSuccessful(),this.nextOperation()},i=>{this.updateFailed(i),this.nextOperation()})}updateProgress(){let e=this.successful+this.failed;this.progressMessage=`Processed ${e}/${this.operationCount} ${E.pluralize(this.options.entityname,this.operationCount)}.`,this.isComplete?this.progressMessage=`${this.progressMessage} Operation completed.`:this.isOperationCancelled()&&(this.progressMessage=`${this.progressMessage} Operation was cancelled ${this.cancelled==="error"?"due to an error":"by the user"}.`),this.detector.markForCheck()}updateSuccessful(){this.successful++;let e=this.options;if(e.customSuccessfulMessage)this.successfulMessage=e.customSuccessfulMessage(this.successful);else{let t=e.operationName;this.successfulMessage=`${this.successful} ${E.pluralize(e.entityname,this.successful)}
				${t}${t.endsWith("e")?"d":"ed"}.`}}updateFailed(e){this.failed++;let t=this.options;t.customFailedMessage?this.failedMessage=t.customFailedMessage(this.failed):this.failedMessage=`Failed to ${t.operationName} ${this.failed} ${E.pluralize(t.entityname,this.failed)}.`,this.addErrorDetails(e)}addErrorDetails(e){e.errorList&&e.errorList.length>0&&e.errorList.forEach(t=>{let i=t.message;i&&(this.failedDetails?this.failedDetails.includes(i)||(this.failedDetails=this.failedDetails+" "+i):this.failedDetails=i)})}updateSkipped(e){this.skipped+=e,this.skippedMessage=`Skipped ${this.skipped} ${E.pluralize(this.options.entityname,this.skipped)}.`}cancelOperation(e){e?this.cancelled="error":this.cancelled="user",this.updateSkipped(this.options.operations.length)}isOperationCancelled(){return this.cancelled==="error"||this.cancelled==="user"}},Ca.ctorParameters=()=>[{type:Ii}],Ca);Ct=d([p({template:Hr,changeDetection:Si.OnPush,styles:[gn]})],Ct);var Ni;(function(m){m[m.Unset=0]="Unset",m[m.Published=1]="Published",m[m.Standard=2]="Standard",m[m.Both=3]="Both"})(Ni||(Ni={}));var Ia,zi=(Ia=class extends R{constructor(e){super("AdminAccessService"),this.context=e,this.pages=new Map([[T.Home,new qe],[T.Settings,new _e],[T.Features,new _e],[T.Properties,new _e],[T.PrivatePages,new _e],[T.PublishedPages,new qe],[T.StandardPages,new _e],[T.DynamicPages,new qe],[T.Archive,new qe],[T.PublishedWidgets,new qe],[T.StandardWidgets,new _e],[T.TenantWidgets,new _e],[T.EarlyAccessWidgets,new _e],[T.FeaturedPages,new qe],[T.FeaturedWidgets,new qe],[T.FeaturedBannerWidgets,new qe],[T.Tags,new qe],[T.Announcements,new qe],[T.SecurityPolicies,new Yn],[T.Import,new _e],[T.Export,new _e],[T.BulkDelete,new _e]])}readable(e){return this.context.tool$.pipe(N(t=>this.pages.get(e).isReadable(t)))}editable(e){return this.context.tool$.pipe(N(t=>this.pages.get(e).isEditable(t)))}},Ia.ctorParameters=()=>[{type:O}],Ia);zi=d([ye({providedIn:"root"})],zi);var _e=class{isReadable(e){return e.isAdministrator}isEditable(e){return e.isAdministrator}},qe=class{isReadable(e){return e.isPageAdministrator||e.isAdministrator||e.isSupportUser}isEditable(e){return e.isPageAdministrator||e.isAdministrator}},Yn=class{isReadable(e){return e.isPageAdministrator||e.isAdministrator||e.isSupportUser}isEditable(e){return e.isAdministrator}};var wa,Wi=(wa=class extends R{constructor(e){super("AdminFeatureService"),this.context=e}isFeatureEnabled(e){return this.context.tool$.pipe(N(t=>{switch(e){case T.DynamicPages:return t.featureGlobalDynamicPages&&t.featureDynamicPages;case T.Archive:return t.featureGlobalDynamicPages&&t.featureDynamicPages;case T.TenantWidgets:return t.featureTenantWidgets;case T.FeaturedBannerWidgets:return t.featureBanner;default:return!0}}))}},wa.ctorParameters=()=>[{type:O}],wa);Wi=d([ye({providedIn:"root"})],Wi);var Aa,Gi=(Aa=class extends R{constructor(e,t,i,s){super("AdminRoutingService"),this.accessService=e,this.featureService=t,this.adminService=i,this.containerService=s,this.nextPageSubject=new ut(T.Home),this.currentPage$=this.nextPageSubject.pipe(ft(),re(a=>this.adminService.setLastVisitedTab(a)),Vt(1)),this.isAdminClosed$=this.containerService.admin$.pipe(N(a=>a.isClose),ft()),this.openedPages$=je(this.currentPage$.pipe(nn()),this.isAdminClosed$).pipe(ra((a,[o,n])=>(n?a.clear():a.set(o,!0),a),new Map)),this.canNavigateTo$=sr(ec.map(a=>this.canNavigateToPage$(a))).pipe(tr(),ra((a,[o,n])=>(a[o]=n,a),{}),Vt(1))}navigateTo(e){this.isAuthorized$(e).pipe(he(1)).subscribe(t=>{t?this.nextPageSubject.next(e):(this.logInfo(`User is not authorized to access ${T[e]}. Defaulting to Home.`),this.nextPageSubject.next(T.Home))})}canNavigateToPage$(e){return zn(this.accessService.readable(e),this.featureService.isFeatureEnabled(e),(t,i)=>[e,t&&i]).pipe(ft(([,t],[,i])=>t===i))}isAuthorized$(e){return zn(this.accessService.readable(e),this.featureService.isFeatureEnabled(e),(t,i)=>t&&i)}},Aa.ctorParameters=()=>[{type:zi},{type:Wi},{type:y},{type:Fe}],Aa);Gi=d([ye({providedIn:"root"})],Gi);var ec=Object.keys(T).filter(m=>isNaN(Number(T[m]))).map(m=>Number(m));var $n=class extends Lr{constructor(e){super(e)}onValidate(e){super.onValidate(e)}},vn=class extends $n{constructor(){super([{max:I.pageTitleLength,name:"t"},{max:I.pageDescriptionLength,name:"d",optional:!0}])}},Te=class Te{static expAccessText(e){let t=e?e.length:0;return Te.accessText(t>0?e[0].title:null,t)}static entityAccessText(e,t){return Te.idsAccessText(e.ais,t)}static getAppliesTo(e,t){return{tooltip:Te.idsAccessToolTip(e,t),cellText:Te.idsAccessText(e,t),icon:Te.idsAccessIcon(e,t),iconClass:Te.idsAccessIconClass(e,t)}}static idsAccessText(e,t){let i=e?e.length:0,s=null;return i>0&&(s=t[e[0]]||Te.missingPolicyText),Te.accessText(s,i)}static idsAccessIcon(e,t){return e&&e.length>0?this.hasMissingAccess(e,t)?"alert":"locked":"url"}static idsAccessIconClass(e,t){return this.hasMissingAccess(e,t)?"icon-alert":""}static hasMissingAccess(e,t){return e&&e.some(i=>!t[i])}static idsAccessToolTip(e,t){if(!e)return null;let i="";for(let s of e)i.length>0&&(i+=", "),i+=t[s]||Te.missingPolicyText;return i}static entityErrorText(e,t){let i=o=>`One or more security policies are ${o}. ${M.policyMissingOrInvalidText}`,s=o=>`This security policy is ${o}. ${M.policyMissingOrInvalidText}`;e=e||[];let a=e.length;for(let o of e)if(!t[o])return a===1?s("no longer available"):i("no longer available or invalid");return a===1?s("invalid"):i("invalid")}static accessText(e,t){return e?(t>1&&(e+=", and "+(t-1)+" more"),e):this.allUsersText}static getOperator(e){let t;return e&&e.length>0&&(t=e[0].operator),t||"||"}static toIds(e){if(!e||!e.length)return null;let t=[];for(let i of e)t.push(i.expressionId);return t}static toExpressions(e,t){let i=e.ais;if(!i||i.length==0)return null;let s=[];for(let a of i){let o=t[a]||Te.missingPolicyText;s.push({title:o,expressionId:a})}return s}static hasAccess(e){let t=e.ais;return t&&t.length>0}static containsAccess(e,t){if(e)for(let i of e){let s=i.ais;if(s){for(let a of s)if(a===t)return!0}}return!1}static getNewEntityId(e){let t=e.ni;return t>=0||(t=0),e.ni=t+1,t+""}static isValidAreaTarget(e,t,i){let s=u.itemByProperty(e.cts,"eid",t.id);if(s){let a=s.ws;if(a)for(let o of a){let n=o.bl||0;if(i=="banner"){if(!(n==1||n==2))return!1}else if(i=="main"&&n==1)return!1}}return!0}static formatProperty(e){let t=e.name;return e.type==="d"?`{${t} | df}`:`{${t}}`}static getComponentTypeLabel(e,t){let i="";switch(e){case k.Image:i="Image";break;case k.Links:{t===1?i="Shortcuts":i="Link list";break}case k.Text:i="Text";break;case k.Items:i="Information";break;case k.Widget:i="Widget";break;case k.Web:i="Web";break;default:Oe.error(`Invalid container type ${e}`)}return i}};Te.allUsersText="All users",Te.noPolicyKey="no-security-policy",Te.missingPolicyText="Missing policy",Te.repairPageText="This page contains missing policies. The affected content will be hidden until the policy restrictions have been updated or cleared. You can also repair the page by using the repair action after importing the missing policies.";var x=Te;var Pa,F=(Pa=class extends R{constructor(e,t,i,s,a,o,n){super("DynamicPageAdminService",n,e),this.dataService=t,this.containerService=i,this.pageService=s,this.storageService=a,this.progressService=o,this.recentAccessesStorageKey="recentDynamicPageAccesses",this.editorToggledSubject=new gt(1),this.editedPageSubject=new ut(null),this.pageListSubject=new ut([]),this.containersSubject=new ut([]),this.settingsSubject=new ut([]),this.accessSubject=new ut([]),this.evaluateAccessSubject=new ut([]),this.filterEntityDeletedSubject=new Ee,this.saveStateChangedSubject=new gt(1),this.containerAddedSubject=new Ee,this.accessTitles={},this.pageComponentCache={},this.recentUserSearches=[],this.editorToggled=this.editorToggledSubject.asObservable(),this.pageList=this.pageListSubject.asObservable(),this.saveStateChanged=this.saveStateChangedSubject.asObservable(),this.containerAdded=this.containerAddedSubject,this.evaluateAccess=this.evaluateAccessSubject.asObservable(),this.filterEntityDeleted=this.filterEntityDeletedSubject.asObservable(),this.pageAccess=this.accessSubject.asObservable(),this.editedPage=je(this.editedPageSubject,this.containersSubject,this.settingsSubject,this.accessSubject).pipe(N(([r,l,c,g])=>r?te(D({},r),{cts:l,sets:c,accs:g}):null))}getAccessTitles(){return this.accessTitles}getPage(){return this.editedPageSubject.getValue()}getPageClone(){return W.copyJson(this.getPage())}editPage(e){return this.loadPage(e,!0)}viewPage(e){return this.loadPage(e,!1)}checkOutPage(e,t){return this.post("/admin/dynamic/page/checkout",{content:e,force:t})}checkInPage(e){return this.post("/admin/dynamic/page/checkin",{content:e})}getExistingInfo(e){return this.post("/admin/dynamic/page/get/exists",{content:e})}publishPage(e){return this.post("/admin/dynamic/page/publish",e).pipe(G(t=>this.handleError("Publish Page","Unable to publish page.",t)))}getPublishInfo(e){return this.post("/admin/dynamic/page/publish/info",{content:e})}deletePage(e){return delete this.pageComponentCache[e],this.post("/admin/dynamic/page/delete",{content:e})}deleteDraftPage(e){return this.post("/admin/dynamic/page/draft/delete",{content:e})}startImportOperation(e){return this.post("/admin/dynamic/operation/import",{parameters:e})}getOperationStatus(){return this.post("/admin/dynamic/operation/status",{})}cancelOperation(){return this.post("/admin/dynamic/operation/cancel",{})}repairPage(e,t){return this.post("/admin/dynamic/page/repair",{content:t,uniqueId:e})}exportPage(e,t,i){let s=this.getExportName(e,"dynamic_page"),o=this.dataService.getUrl(`admin/dynamic/page/export/${s}.zip`)+`?pageId=${t}&convertPolicies=${i}`;this.openWindow(o)}exportPageLocalization(e,t,i){let s=this.getExportName(e,"dynamic_page"),o=this.dataService.getUrl(`admin/dynamic/page/localization/export/${s}_languages.zip`)+`?pageId=${t}&languages=${encodeURIComponent(i)}`;this.openWindow(o)}closeEditor(){this.logDebug("closeEditor"),this.nextPage(null),this.nextContainers(null),this.nextSettings(null),this.nextAccess([])}preview(e){let t=this.containerService,i=null,s=!0;e&&(i=e.pageId,s=e.isDraft!==!1),i||(i=this.getPage().eid);let a={pageId:i,isDynamic:!0,isDraft:s,dynamicPreviewOptions:e,isDuplicatable:!1,isAddable:!1,notifyMingle:!1,onClose:()=>{t.showAdmin()}};this.progressService.onNextNotBusy(()=>t.hideAdmin(T.DynamicPages,!1)),this.pageService.previewPage(a)}getRecentUserSearches(){return this.recentUserSearches}addUserToRecentSearch(e){u.removeByProperty(this.recentUserSearches,"id",e.id),this.recentUserSearches.unshift(e),this.recentUserSearches.length>5&&this.recentUserSearches.pop()}listPages(e){return this.loadPageList(e)}refreshPage(){this.nextPage(this.getPage())}createPage(e,t,i,s,a,o,n){let r=this.createPageRequest(e,t,i,s,a,o,n);return this.post("/admin/dynamic/page/create",r).pipe(G(l=>this.handleError("Add Page","Unable to add page.",l)),N(l=>l.page),re(l=>this.onCreatePage(l)))}onCreatePage(e){this.nextPage(e),this.nextContainers([]),this.nextSettings(e.sets),this.nextAccess([]),this.pageComponentCache[e.pid]=0}addLinkList(e,t,i){return this.addContainer({st:t,its:[],ct:k.Links,clt:ie.InheritPage},e,i)}addImage(e,t){return this.addContainer({ims:[],ct:k.Image,clt:ie.InheritPage},e,t)}addWidget(e,t){return this.addContainer({ws:[],ct:k.Widget,clt:ie.InheritPage},e,t)}addWeb(e,t){return this.addContainer({wbs:[],ct:k.Web,clt:ie.InheritPage},e,t)}addText(e,t){return this.addContainer({txts:[],ct:k.Text,clt:ie.InheritPage},e,t)}addItems(e,t){return this.addContainer({hds:[],its:[],ct:k.Items,clt:ie.InheritPage},e,t)}addSetting(e){let t=this.createSettingRequest(e);return this.post("/admin/dynamic/content/create",t).pipe(G(i=>this.handleError("Add Setting","Unable to add setting",i)),re(i=>{e.lzn&&(i.setting.lzn=e.lzn),this.onAddSetting(i),e.lzn&&this.updatePageLanguages(i.setting.lzn,this.getDeletedLanguages(i.setting.lzn))}),N(i=>i.setting.eid))}addContainerEntity(e,t,i,s){let a=this.updateContainerContentRequest(e,t,null,i);return this.executeUpdateContainer(a,e,s)}addContainerEntityCopies(e,t,i){let s=v.copy(e),a=this.getCollection(s),o={},n=[];for(let g of t){let P=x.getNewEntityId(s);if(l(g.eid,P),g.ais)for(let z of g.ais)!this.isExpUsed(z)&&n.indexOf(z)===-1&&n.push(z);a.push(te(D({},g),{eid:P}))}c();let r={container:te(D({},s),{pid:this.getPage().pid})};n.length&&(r.createAccessIds=n);function l(g,P){for(let z in i){let Z=i[z].its[g];Z&&(o[z]?o[z].its[P]=Z:o[z]={its:{[P]:Z}})}}function c(){if(!Object.keys(o).length)return;s.lzn=s.lzn||{};let g=s.lzn;for(let P in o)g[P]?g[P].its?g[P].its=D(D({},g[P].its),o[P].its):g[P].its=o[P].its:(g[P]=o[P],g[P].t=""),g[P].op=pe.Update}return this.executeUpdateContainer(r)}editContainerEntity(e,t,i,s){let a=this.updateContainerContentRequest(e,t,i,s);return this.executeUpdateContainer(a)}editContainerEntityWithLocalization(e,t,i,s,a){let o=this.updateContainerContentRequest(e,t,i,a);return this.executeUpdateContainer(o,e,s)}updateContainer(e,t,i,s){let a=v.copy(e);if(i&&a.lzn)for(let n of Object.keys(a.lzn)){for(let r of i)a.lzn[n].its&&a.lzn[n].its[r.eid]&&(delete a.lzn[n].its[r.eid],a.lzn[n].op=pe.Update,s=!0);!a.lzn[n].t&&!(a.lzn[n].its&&Object.keys(a.lzn[n].its).length>0)&&(a.lzn[n].op=pe.Delete,s=!0)}let o=this.updateContainerRequest(a,t,i,s);return this.executeUpdateContainer(o,a,t)}deleteSetting(e){let t=this.deleteSettingRequest(e),i=this.markForDeletion(e.lzn);return this.post("/admin/dynamic/content/delete",t).pipe(G(s=>this.handleError("Delete Setting","Unable to delete setting.",s)),re(s=>{this.onDeleteSetting(s,e),this.updatePageLanguages(e.lzn,i)}))}nextEditorToggled(e){this.editorToggledSubject.next(e)}nextSaveStateChanged(e){this.saveStateChangedSubject.next(e)}nextContainerAdded(e,t){this.containerAddedSubject.next({area:e,index:t})}nextEvaluateAccess(){let e=this.accessSubject.getValue();this.evaluateAccessSubject.next(e)}nextFilterEntityDeleted(e){this.filterEntityDeletedSubject.next(e)}updateSetting(e,t){let i=this.updateSettingsRequest(e,t);return this.post("/admin/dynamic/content/update",i).pipe(G(a=>this.handleError("Update Setting","Unable to update setting.",a)),re(a=>{a.setting.lzn=D(D({},t.lzn),i.setting.lzn),this.onUpdatedSetting(a),this.updatePageLanguages(i.setting.lzn,this.getDeletedLanguages(i.setting.lzn))}),N(a=>a.setting.eid))}updateLink(e,t,i,s){let a=this.updateContainerContentRequest(e,i,s);return this.post("/admin/dynamic/content/update",a).pipe(G(o=>this.handleError("Update Component","Unable to update component.",o)),N(o=>(a.container.lzn&&(o.container.lzn=D(D({},t.lzn),e.lzn)),o)),re(o=>{this.onUpdateContainer(o)}),N(o=>o.container.eid))}deleteContainer(e,t){let i=this.deleteContainerRequest(e),s=this.markForDeletion(e.lzn);return this.post("/admin/dynamic/content/delete",i).pipe(G(a=>this.handleError("Delete Component","Unable to delete component.",a)),re(a=>{this.onDeleteContainer(a,e),this.updatePageLanguages(e.lzn,s)}))}updatePage(e){let t=this.toUpdatePage(e);return this.post("/admin/dynamic/content/update",{page:t}).pipe(G(i=>this.handleError("Update Page","Unable to update page.",i)),re(i=>this.onUpdatePage(i,e.sets)),N(i=>i.page))}getDeletedLanguages(e){let t=[];if(e)for(let i of Object.keys(e))e[i].op===pe.Delete&&t.push(i);return t}markForDeletion(e){let t=[];if(e)for(let i of Object.keys(e))e[i].op=pe.Delete,t.push(i);return t}openWindow(e){this.isDebug()&&this.logDebug("Executing url "+e),window.open(e,"_blank")}getExportName(e,t){for(;e&&e.charAt(0)===".";)e=e.substring(1);return e||(e=t),encodeURIComponent(e.replace(/ /g,"_"))}onAddSetting(e){let t=this.settingsSubject.getValue();this.onPageContentUpdated(e),this.onUpdatedAccess(e),this.nextSettings([e.setting,...t]),this.nextEvaluateAccess()}onDeleteSetting(e,t){this.onPageContentUpdated(e),this.onUpdatedAccess(e);let i=this.settingsSubject.getValue();this.nextSettings(i.filter(s=>s.eid!==t.eid)),this.nextEvaluateAccess()}onUpdatedSetting(e){this.onUpdatedAccess(e);let t=e.setting,i=this.settingsSubject.getValue();this.nextSettings(i.map(s=>s.eid===t.eid?t:s)),this.nextEvaluateAccess()}onDeleteContainer(e,t){this.onPageContentUpdated(e),this.onUpdatedAccess(e),this.pageComponentCache[t.pid]--;let i=this.containersSubject.getValue();this.nextContainers(i.filter(s=>s.eid!==t.eid)),this.nextEvaluateAccess()}onUpdateContainer(e){this.onPageContentUpdated(e),this.onUpdatedAccess(e);let t=e.container,i=this.containersSubject.getValue();this.nextContainers(i.map(s=>s.eid===t.eid?t:s)),this.nextEvaluateAccess()}onUpdatePage(e,t){let i=e.page;i.sets=t,i.accs=this.accessSubject.getValue(),i.cts=this.containersSubject.getValue(),this.nextPage(i)}toUpdatePage(e){let t={pid:e.pid,eid:e.eid,ly:e.ly},i=e.sets||this.settingsSubject.getValue();if(i){let s=i.map(a=>{let o={id:a.eid};return a.ais&&(o.ais=a.ais),o});t.seto=s}return t}addContainer(e,t,i){let s=I.dynPageMaxComponentsOnPage,a=this.getPage();if(this.pageComponentCache[a.pid]>=s)return this.showError("Add Component",`You are not allowed to add more than ${s} components.`),Y();let o=this.createContainerRequest(e,t,i);return this.post("/admin/dynamic/content/create",o).pipe(G(n=>this.handleError("Add Component","Unable to add component.",n)),re(n=>this.onAddContainer(n,t,i)),N(n=>n.container.eid))}onAddContainer(e,t,i){this.onPageContentUpdated(e);let s=e.container;this.pageComponentCache[s.pid]++;let a=this.containersSubject.getValue();this.nextContainers([...a||[],s]),this.nextContainerAdded(t,i)}onPageContentUpdated(e){let t=e.page;if(t){let i=this.getPage();i.ly=t.ly||i.ly,i.seto=t.seto||i.seto}}loadPage(e,t){let i=!t,s={content:e,isReadOnly:i};return this.post("/admin/dynamic/page/get",s,!0).pipe(G(a=>this.handleError(t?"Edit Page":"View Page","Unable to load page",a)),re(a=>{this.onLoadPage(a,i)}),N(a=>a.page))}onLoadPage(e,t){let i=e.page;i.isReadOnly=t,this.updateAccessInfo(i),this.nextPage(i),this.nextContainers(i.cts),this.pageComponentCache[i.pid]=i.cts?i.cts.length:0,this.nextSettings(i.sets),this.nextAccess(i.accs),this.nextEvaluateAccess()}loadPageList(e){return this.post("/admin/dynamic/page/list",e,!0).pipe(re(t=>this.pageListSubject.next(t.content)))}isExpUsed(e){let t=this.accessSubject.getValue();return u.containsByProperty(t,"exid",e)}isLastExpUsed(e,t,i,s){return this.isExpUsed(e)?this.isLastExpEntry(e,t,i,s):!1}isLastExpByCount(e,t){let i=0,s=this.settingsSubject.getValue();if(i+=this.countExpMaxTwo(s,e),i>1)return!1;let a=this.containersSubject.getValue();for(let o of a){this.hasExp(o,e)&&i++;let n=t&&t.containerId===o.eid?t.count:0;if(i+=this.countExpMaxTwo(o.its,e,n),i+=this.countExpMaxTwo(o.ims,e,n),i+=this.countExpMaxTwo(o.hds,e,n),i+=this.countExpMaxTwo(o.ws,e,n),i+=this.countExpMaxTwo(o.wbs,e,n),i+=this.countExpMaxTwo(o.txts,e,n),i>1)return!1}return i<=1}isLastExpEntry(e,t,i,s){if(!t&&!i)return this.isLastExpByCount(e,s);let o=0,n=2,r=this.settingsSubject.getValue();o+=this.countExpMaxTwo(r,e);let l=this.containersSubject.getValue();if(l)for(let c of l){if(c.eid===i){n=1;continue}if(this.hasExp(c,e)&&o++,o+=this.countExpMaxTwo(c.its,e),o+=this.countExpMaxTwo(c.ims,e),o+=this.countExpMaxTwo(c.hds,e),o+=this.countExpMaxTwo(c.ws,e),o+=this.countExpMaxTwo(c.wbs,e),o+=this.countExpMaxTwo(c.txts,e),o>=n)return!1}return o<n}countExpMaxTwo(e,t,i){let s=0;if(e&&e.length){i&&(s-=i);for(let a of e)if(this.hasExp(a,t)&&(s++,s>=2))return s}return s}hasExp(e,t){let i=e.ais;if(i){for(let s of i)if(s===t)return!0}return!1}onUpdatedAccess(e){let t=e.accesses,i=e.deletedAccessIds;if(!t&&!i)return;let a=[...this.accessSubject.getValue()];if(i){let o=[];for(let n of i)u.removeByPredicate(a,r=>r.exid==n),o.push({filterScope:"access",filterEntity:n});this.nextFilterEntityDeleted(o)}t&&(a.push(...t),this.updateRecentlyUsedAccesses(t)),this.nextAccess(a)}createPageRequest(e,t,i,s,a,o,n){return{page:{t:e,d:t},setting:{t:e,d:t,cl:i,lzn:s,em:a,md:o,dma:n}}}createEntityRequest(e){let t=this.getPage(),i={};return this.applyPageUpdate(i,t,e,e.ais,null,null,null),i}deleteEntityRequest(e){let t=this.getPage(),i={};return this.applyPageUpdate(i,t,e,null,e.ais,null,e.eid),i}createContainerRequest(e,t,i){let s=this.getPage(),a=this.createEntityRequest(e);return a.contentArea=t,a.contentIndex=Tt.isNumber(i)?i:-1,a.container=te(D({},e),{pid:s.pid}),a}executeUpdateContainer(e,t,i){let s=t?this.getDeletedLanguages(t.lzn):[];return this.post("/admin/dynamic/content/update",e).pipe(G(a=>this.handleError("Update component","Unable to update component.",a)),N(a=>{if(i)if(e.container.lzn){let o=v.copy(i);i.lzn&&t.lzn&&this.removeDeletedItemLocalizations(t,o),a.container.lzn=D(D({},o.lzn),t.lzn)}else a.container.lzn=D({},i.lzn);else a.container.lzn=e.container.lzn;return a}),re(a=>{this.onUpdateContainer(a),this.updatePageLanguages(a.container.lzn,s)}),N(a=>a.container.eid))}removeDeletedItemLocalizations(e,t){for(let i of Object.keys(t.lzn))if(e.lzn[i])if(t.lzn[i].its)if(e.lzn[i].its&&Object.keys(e.lzn[i].its).length>0)for(let s of Object.keys(t.lzn[i].its))e.lzn[i][s]||delete t.lzn[i][s];else t.lzn[i].t?delete t.lzn[i].its:delete t.lzn[i],e.lzn[i].t?delete e.lzn[i].its:delete e.lzn[i];else e.lzn[i].op==pe.Delete&&(delete e.lzn[i],delete t.lzn[i])}createSettingRequest(e){let t=this.getPage(),i=this.createEntityRequest(e);return i.setting=te(D({},e),{pid:t.eid}),i}deleteSettingRequest(e){let t=this.getPage(),i=this.deleteEntityRequest(e);return i.setting=te(D({},e),{pid:t.eid}),i}updateSettingsRequest(e,t){let i=this.updateEntityRequest(e,t);return i.setting=e,i}deleteContainerRequest(e){let t=this.getChildAccess(e),i=this.getPage(),s={};return this.applyPageUpdate(s,i,e,null,e.ais,t,e.eid),s.container={eid:e.eid,pid:e.pid,t:e.t,d:e.d},s}getChildAccess(e){let t={};return this.addAccess(t,e.its),this.addAccess(t,e.ims),this.addAccess(t,e.ws),this.addAccess(t,e.hds),this.addAccess(t,e.wbs),this.addAccess(t,e.txts),[...Object.keys(t)]}addAccess(e,t){if(t)for(let i of t){let s=i.ais;if(s)for(let a of s)e[a]=a}}updateContainerRequest(e,t,i,s){let a=this.getPage(),o=v.copy(e);s||(o.lzn=null);let n=this.updateEntityRequest(o,t,i),r=a.pid;return n.container=te(D({},e),{pid:r}),n}updateContainerContentRequest(e,t,i,s){let a=this.getPage(),o=this.updateEntityRequest(t,i),n=a.pid,r=v.copy(e),l=this.getCollection(r);if(s&&(l=r.hds),i){let c=u.indexByProperty(l,"eid",i.eid);l[c]=t}else l.push(t);return o.container=te(D({},r),{pid:n}),o}getCollection(e){switch(e.ct){case k.Image:return e.ims;case k.Widget:return e.ws;case k.Web:return e.wbs;case k.Text:return e.txts;default:return e.its}}updateEntityRequest(e,t,i){let s=this.getPage(),a={},o=null,n=null;if(i){let c=[];for(let g of i)g.ais&&(c=[...c,...g.ais]);return c.length&&this.applyPageUpdate(a,s,e,null,null,c,null),a}let r=e?e.ais:null,l=t?t.ais:null;return o=this.diffAddAccess(r,l),n=this.diffDeleteAccess(r,l),(o||n)&&this.applyPageUpdate(a,s,e,o,n,null,null),a}diffAddAccess(e,t){if(!e||!t)return e;let i=e.filter(s=>t.indexOf(s)<0);return i.length?i:null}diffDeleteAccess(e,t){if(!e||!t)return t;let i=t.filter(s=>e.indexOf(s)<0);return i.length?i:null}applyPageUpdate(e,t,i,s,a,o,n){let r=[];if(s)for(let z of s)u.contains(r,z)||!this.isExpUsed(z)&&r.push(z);let l=[],c=i.eid;if(o&&o.length>0)for(let z of o){let Z={count:o.filter(me=>me===z).length-1,containerId:i.eid};this.isLastExpUsed(z,null,n,Z)&&l.push(z)}if(a)for(let z of a)!u.contains(l,z)&&this.isLastExpUsed(z,c,null,null)&&l.push(z);r.length>0&&(e.createAccessIds=r),l.length>0&&(e.deleteAccessIds=l.filter((z,Z)=>l.indexOf(z)===Z));let P=this.toUpdatePage(t);if(s||a){let z=this.findInLayout(P,i.eid)||this.findInSettings(P,i.eid);z&&(s?z.ais=i.ais:a&&delete z.ais)}e.page=P}findInLayout(e,t){let i=e.ly;if(i){let s=i.areas;if(s)for(let a of Object.keys(s)){let n=s[a].find(r=>r.id===t);if(n)return n}}return null}findInSettings(e,t){let i=e.seto;return i?i.find(s=>s.id===t):null}updateAccessInfo(e){this.accessTitles={};let t=e.accs;if(t)for(let i of t)this.accessTitles[i.exid]=i.t}nextPage(e){this.editedPageSubject.next(e)}nextAccess(e){let t=this.getPage();t&&(t.accs=e),this.accessSubject.next(e)}nextContainers(e){let t=this.getPage();t&&(t.cts=e),this.containersSubject.next(e)}nextSettings(e){let t=this.getPage();t&&(t.sets=e),this.settingsSubject.next(e)}post(e,t,i){return i||this.nextSaveStateChanged(pn.Saving),this.dataService.post(e,t).pipe(re(()=>{i||this.nextSaveStateChanged(pn.AllSaved)},()=>{i||this.nextSaveStateChanged(pn.SaveFailed)}))}handleError(e,t,i){return i&&i.hasError()&&!i.hasGenericError()?this.showError(e,`${i.getErrorMessages()}`):this.showError(e,t),er(i)}updatePageLanguages(e,t){if(!e)return;let i=v.copy(this.getPage());i.lngs=this.createPageLangArray(e,i,t),this.nextPage(i)}createPageLangArray(e,t,i){let s=t.lngs?t.lngs:[];function a(o){if(o){let n=[];o.forEach(r=>{r.lzn&&i.forEach(l=>{r.lzn[l]&&n.indexOf(l)===-1&&(r.lzn[l].t||r.lzn[l].its&&Object.keys(r.lzn[l].its).length>0)&&n.push(l)})}),n.forEach(r=>{i.splice(i.indexOf(r),1)})}}for(let o of Object.keys(e))t.lngs&&t.lngs.indexOf(o)===-1&&s.push(o);return i.length>0&&(a(t.sets),a(t.cts),i.forEach(o=>{let n=s.indexOf(o);n!=-1&&s.splice(n,1)})),s}updateRecentlyUsedAccesses(e){let t=this.storageService.getLocalStorageItem(this.recentAccessesStorageKey)||[],i=e.map(a=>a.exid),s=[...i,...t.filter(a=>i.indexOf(a)===-1)].slice(0,250);this.storageService.setLocalStorageItem(this.recentAccessesStorageKey,s)}},Pa.ctorParameters=()=>[{type:L},{type:St},{type:Fe},{type:Rt},{type:lt},{type:dt},{type:b}],Pa);F=d([ye({providedIn:"root"})],F);var Xr=m=>N(e=>m===K.featureBannerWidget?!0:e.find(s=>s.settingName===m).value==="true"),Da,be=(Da=class extends R{constructor(e,t,i){super("AdminSettingsService"),this.context=e,this.adminService=t,this.localeDatePipe=i,this.tool$=this.context.tool$.pipe(re(()=>{this.isRulesChanged=!1,this.isSettingsChanged=!1}),Vt(1)),this.features$=this.tool$.pipe(N(s=>s.settings.filter(a=>this.isFeature(a)))),this.featureItems$=this.features$.pipe(N(s=>this.createFeatureItems(s))),this.isBannerEnabled$=this.features$.pipe(Xr(K.featureBannerWidget),ft()),this.isDynamicPagesEnabled$=this.features$.pipe(Xr(K.featureDynamicPages),ft()),this.settings$=this.tool$.pipe(N(s=>s.settings.filter(a=>!this.isFeature(a)))),this.settingItems$=je(this.settings$,this.isBannerEnabled$).pipe(na(1),N(([s,a])=>this.createSettingItems(s,a))),this.settingsValidators=new Map([[K.adminContactInfo,new xn],[K.adminEmail,new xn]])}update(e,t){let i=new Ce;if(!this.isSettingsValid(e))return i.error(new Error("Settings are not valid.")),i.asObservable();if(!this.isRulesChanged&&!this.isSettingsChanged)return i.complete(),i.asObservable();let s=[];return this.isRulesChanged&&s.push(this.updateRules(e,t)),this.isSettingsChanged&&s.push(this.updateSettings(e)),Fn(s).subscribe(()=>{this.context.nextTool(!1),i.next(),i.complete()},a=>{i.error(a)}),i.asObservable()}isSettingsValid(e){return e.filter(t=>this.hasValidator(t.settingName)).every(t=>this.isValid(t.settingName,t.value))}isRulesValid(e){return e.filter(t=>this.hasValidator(t.settingName)).every(t=>this.isValid(t.settingName,t.value))}hasValidator(e){return this.settingsValidators.has(e)}isValid(e,t){return this.settingsValidators.get(e).isValid(t)}computeSettings(e,t,i){for(let s of t){let a=this.getSettingIndex(e,s.settingName);i(s,a)}}updateRules(e,t){let i=new Ce,s=t.map(o=>v.copy(e.find(n=>n.settingName===o)));if(!s.every(o=>this.isRulesValid(o.rules)))return i.error(new Error("Setting rules are not valid.")),i.asObservable();let a=s.map(o=>(o.setting.rules=o.rules,this.adminService.updateSettingRules(v.copy(o.setting))));return Fn(a).subscribe(o=>{let n=this.getSettings(),r=o.map(l=>l.content);this.computeSettings(n,r,(l,c)=>{n[c].rules=l.rules}),this.isRulesChanged=!1,i.next(),i.complete()},o=>{i.error(o)}),i.asObservable()}updateSettings(e){let t=new Ce,i=this.getSettings();return this.adminService.updateSettings(this.getUpdatedSettings(e)).subscribe(s=>{let a=s.content;this.computeSettings(i,a,(o,n)=>{o.isChanged=!1,i[n]=o}),t.next(),t.complete()},s=>{t.error(s)}),t.asObservable()}getUpdatedSettings(e){return v.copy(this.getSettings()).filter(i=>this.getSettingItemIndex(e,i.settingName)!==-1).map(i=>{let s=this.getSettingItem(e,i.settingName);if(s&&s.setting&&s.setting.isChanged){let a;s.type==="boolean"?a=s.value?"true":"false":a=s.value,i.value=a,i.isChanged=!0}return i}).filter(i=>i.isChanged)}getSettingIndex(e,t){return e.map(i=>i.settingName).indexOf(t)}getSettingItemIndex(e,t){return e.map(i=>i.settingName).indexOf(t)}getSettingItem(e,t){return e.find(i=>i.settingName===t)}isFeature(e){return e.area===M.featureArea}getSettings(){return this.context.get().settings}createFeatureItems(e){return e.map(t=>this.createFeatureItem(t))}createFeatureItem(e){let t=e.value,i=e.descriptions,s=i?i.length:0;return{setting:e,value:t==="true",values:[],displayValue:t,rules:[],type:ve.typeBool,changeDate:this.localeDatePipe.transform(e.changeDate),changedByName:e.changedByName,settingName:e.settingName,noOfRules:0,description1:s>0?i[0]:"",description2:s>1?i[1]:"",description3:s>2?i[2]:""}}createSettingItems(e,t){return e.map(i=>this.createSettingItem(i,t))}createSettingItem(e,t){let i=e.dataType,s=e.value,a=e.values||[],o=e.settingName,n=e.descriptions,r=n?n.length:0,l=this.createRules(e);return e.settingName===K.enableBannerWidgetEdit&&(e.isVisible=t),{setting:e,value:this.resolveValue(s,i),values:a,displayValue:this.resolveDisplayValue(s,o,a),rules:l,type:this.resolveType(o,i,a),changeDate:this.localeDatePipe.transform(e.changeDate),changedByName:e.changedByName,settingName:o,noOfRules:l.length,description1:r>0?n[0]:"",description2:r>1?n[1]:""}}resolveValue(e,t){return t===ve.typeBool?e==="true":e}resolveDisplayValue(e,t,i){if(i&&i.length){let s=u.itemByProperty(i,"value",e);if(s)return s.label}else if(t===K.mandatoryPages||t===K.defaultPage)return Le.getPageDisplayValue(e);return e}resolveType(e,t,i){if(i&&i.length)return ve.typeSelector;switch(e){case K.maxUserPageCount:case K.maxWidgetsOnPageCount:return ve.typeIntSelector;case K.mandatoryPages:return ve.typeMandatoryPages;case K.defaultPage:return ve.typeDefaultPages;case K.adminContactInfo:return K.adminContactInfo}return t}createRules(e){return(e.rules?v.copy(e.rules):[]).map(i=>this.createRule(e,i))}createRule(e,t){let i=e.dataType,s=t.value,a=e.values||[],o=e.settingName;t.value=this.resolveValue(s,i),t.displayValue=this.resolveDisplayValue(s,o,a),t.displayChangeDate=this.localeDatePipe.transform(t.changeDate),t.ruleConnections=t.ruleConnections||[],t.affectedUsers=t.ruleConnections.length;for(let n of t.ruleConnections)n.displayChangeDate=this.localeDatePipe.transform(n.changeDate);return t}},Da.ctorParameters=()=>[{type:O},{type:y},{type:Tr}],Da);be=d([ye({providedIn:"root"})],be);var xn=class{isValid(e){return!(e&&(e.indexOf("<script")>=0||e.indexOf("<\/script")>=0))}};var Kr=`\uFEFF<div\r
	#adminSettingsView\r
	class="lm-admin-base-font-size"\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div *ngIf="hasTool">\r
		<div class="row">\r
			<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
				<soho-toolbar-flex-section [isTitle]="true">\r
					<nav *ngIf="!isFeatureMode" class="breadcrumb" role="navigation">\r
						<ol aria-label="breadcrumb">\r
							<li [class.current]="navState === 'settings'">\r
								<a\r
									(click)="listSettings()"\r
									id="lm-a-set-bc-set"\r
									class="hyperlink"\r
									>Settings</a\r
								>\r
							</li>\r
							<li\r
								*ngIf="navState !== 'settings'"\r
								id="lm-a-set-bc-l"\r
								[class.current]="navState === 'rules'">\r
								<a\r
									id="lm-a-set-bc-ruleslist"\r
									(click)="listRules()"\r
									class="hyperlink"\r
									>{{ selectedSetting?.setting.label }}</a\r
								>\r
							</li>\r
							<li\r
								*ngIf="navState === 'connections'"\r
								id="lm-a-set-bc-c"\r
								[class.current]="navState === 'connections'">\r
								<a id="lm-a-set-bc-connections" class="hyperlink">{{\r
									selectedRule?.name\r
								}}</a>\r
							</li>\r
						</ol>\r
					</nav>\r
				</soho-toolbar-flex-section>\r
				<soho-toolbar-flex-section [isButtonSet]="true">\r
					<ng-container *ngIf="!isFeatureMode">\r
						<button\r
							soho-menu-button\r
							[class.lm-display-none]="navState !== 'settings'"\r
							icon="filter"\r
							id="lm-a-set-tb-a"\r
							menu="settings-area-popupmenu">\r
							{{ selectedArea?.name }}\r
						</button>\r
						<ul soho-popupmenu id="settings-area-popupmenu">\r
							<li *ngFor="let area of settingAreas">\r
								<a\r
									href=""\r
									[attr.data-lm-a-set-tb-a-li]="area.value"\r
									[name]="area.name | lmAutoId: 'lm-a-set-area-option'"\r
									(click)="selectArea(area, true)"\r
									lm-enter-to-click\r
									>{{ area.name }}</a\r
								>\r
							</li>\r
						</ul>\r
						<div class="separator" *ngIf="navState === 'settings'"></div>\r
					</ng-container>\r
					<button\r
						soho-button="tertiary"\r
						[id]="isFeatureMode ? 'lm-a-fe-tb-d' : 'lm-a-set-tb-d'"\r
						icon="close-cancel"\r
						[disabled]="areActionButtonsDisabled()"\r
						data-action="discard">\r
						Discard\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						[id]="isFeatureMode ? 'lm-a-fe-tb-s' : 'lm-a-set-tb-s'"\r
						icon="save"\r
						[disabled]="areActionButtonsDisabled()"\r
						data-action="save">\r
						Save\r
					</button>\r
					<ng-container *ngIf="!isFeatureMode">\r
						<div class="separator" *ngIf="navState !== 'settings'"></div>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-set-tb-aru"\r
							icon="add"\r
							*ngIf="navState === 'rules'"\r
							(click)="openAddOrEditRule()">\r
							Add Rule\r
						</button>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-set-tb-au"\r
							icon="add"\r
							*ngIf="navState === 'connections'"\r
							(click)="addUser()">\r
							Add User\r
						</button>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-set-tb-aro"\r
							icon="add"\r
							*ngIf="navState === 'connections'"\r
							(click)="addRole()">\r
							Add Role\r
						</button>\r
					</ng-container>\r
					<div class="separator"></div>\r
					<button\r
						soho-button="icon"\r
						[id]="isFeatureMode ? 'lm-a-fe-tb-r' : 'lm-a-set-tb-r'"\r
						icon="refresh"\r
						data-action="reload"\r
						style="border: 0; margin-bottom: 0"\r
						soho-tooltip\r
						title="Refresh">\r
						<span class="audible">Refresh</span>\r
					</button>\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
			</soho-toolbar-flex>\r
		</div>\r
\r
		<!-- Datagrids -->\r
		<div\r
			#featuresDatagrid\r
			*ngIf="isFeatureMode"\r
			id="adminFeaturesGrid"\r
			soho-datagrid\r
			[gridOptions]="featuresGridOptions"\r
			[data]="featuresGridOptions.dataset"></div>\r
		<ng-container *ngIf="!isFeatureMode">\r
			<div\r
				#settingsDatagrid\r
				*ngIf="settingsGridOptions?.dataset?.length && navState === 'settings'"\r
				id="adminSettingsGrid"\r
				soho-datagrid\r
				[gridOptions]="settingsGridOptions"\r
				[data]="settingsGridOptions.dataset"\r
				(filtered)="onFiltered($event)"></div>\r
			<div\r
				*ngIf="navState === 'rules'"\r
				class="contextual-toolbar toolbar is-hidden">\r
				<div class="title" id="lm-a-set-grd-tb-rul-h">Actions</div>\r
				<div class="buttonset">\r
					<button\r
						soho-button="tertiary"\r
						id="lm-a-set-grd-tb-rul-e"\r
						icon="edit"\r
						[disabled]="selectionCount !== 1"\r
						(click)="openAddOrEditRule(selected)">\r
						Edit\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						id="lm-a-set-grd-tb-rul-d"\r
						icon="delete"\r
						(click)="deleteRules()">\r
						Delete ({{ selectionCount }})\r
					</button>\r
				</div>\r
			</div>\r
			<div\r
				#rulesDatagrid\r
				*ngIf="navState === 'rules'"\r
				id="adminRulesGrid"\r
				soho-datagrid\r
				(selected)="updateGridSelection($event.rows)"\r
				[gridOptions]="rulesGridOptions"\r
				[data]="rulesGridOptions.dataset"\r
				[rowReorder]="true"\r
				(rowReordered)="onRowReordered($event)"></div>\r
\r
			<div\r
				*ngIf="navState === 'connections'"\r
				class="contextual-toolbar toolbar is-hidden">\r
				<div class="title" id="lm-a-set-grd-tb-con-h">Actions</div>\r
				<div class="buttonset">\r
					<button\r
						soho-button="tertiary"\r
						id="lm-a-set-grd-tb-con-d"\r
						icon="delete"\r
						(click)="deleteConnections()">\r
						Delete ({{ selectionCount }})\r
					</button>\r
				</div>\r
			</div>\r
			<div\r
				#connectionsDatagrid\r
				*ngIf="navState === 'connections'"\r
				id="adminConnectionsGrid"\r
				soho-datagrid\r
				(selected)="updateGridSelection($event.rows)"\r
				[gridOptions]="connectionsGridOptions"\r
				[data]="connectionsGridOptions.dataset"></div>\r
\r
			<div class="row" style="padding-right: 0px">\r
				<div class="six columns" style="margin-left: 0px">\r
					<div class="lm-admin-quota-message">\r
						<p\r
							*ngIf="isFiltered && navState === 'settings'"\r
							id="lm-a-set-showcounttext">\r
							{{ getItemCountText() }}\r
							<span\r
								>There are active filters.\r
								<a\r
									soho-hyperlink\r
									id="lm-a-settings-clearfilters"\r
									(click)="clearFilters()"\r
									>Clear all</a\r
								>\r
							</span>\r
						</p>\r
					</div>\r
				</div>\r
				<div class="six columns">\r
					<div class="toolbar lm-text-align-r" role="toolbar">\r
						<div class="buttonset">\r
							<button\r
								soho-button="tertiary"\r
								id="lm-a-set-d"\r
								icon="close-cancel"\r
								[disabled]="areActionButtonsDisabled()"\r
								(click)="discard()">\r
								Discard\r
							</button>\r
							<button\r
								soho-button="tertiary"\r
								id="lm-a-set-s"\r
								icon="save"\r
								[disabled]="areActionButtonsDisabled()"\r
								(click)="save()">\r
								Save\r
							</button>\r
						</div>\r
					</div>\r
				</div>\r
			</div>\r
		</ng-container>\r
	</div>\r
	<ul soho-popupmenu id="settingsgrid-actions-menu">\r
		<li soho-popupmenu-item>\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-set-grd-act-e"\r
				(click)="setSettingValue()"\r
				>Edit</a\r
			>\r
		</li>\r
		<li *ngIf="!selectedSetting?.setting.isTenant" soho-popupmenu-item>\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-set-grd-act-ar"\r
				(click)="openAddOrEditRule()"\r
				>Add Rule</a\r
			>\r
		</li>\r
	</ul>\r
</div>\r
`;var el=`.flex-toolbar .title{padding-left:7px}
/*# sourceMappingURL=settings.css.map */
`;var tl=`\uFEFF<div\r
	class="lm-admin-dialog-width lm-admin-dialog-height"\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<!-- Rule name -->\r
	<div class="field">\r
		<label for="ruleName" class="required">Name</label>\r
		<input\r
			id="ruleName"\r
			class="e2e-ruleName"\r
			[(ngModel)]="ruleName"\r
			maxlength="64"\r
			aria-required="true"\r
			data-validate="required" />\r
	</div>\r
\r
	<hr class="lm-margin-zero lm-margin-lg-b" />\r
	<!-- Set value(s) -->\r
	<div #ruleDialogView class="row lm-setting-dialog">\r
		<div class="column">\r
			<div *ngIf="setting" [ngSwitch]="setting.type">\r
				<div *ngSwitchCase="'selector'" class="field">\r
					<label\r
						class="label e2e-rule-selector"\r
						[attr.for]="setting.settingName"\r
						>{{ setting.setting.label }}</label\r
					>\r
					<select\r
						soho-dropdown\r
						[name]="'lm-a-rule-edit-' + setting.settingName"\r
						[attributes]="{\r
							name: 'id',\r
							value: 'lm-a-rule-edit-' + setting.settingName\r
						}"\r
						[(ngModel)]="value">\r
						<option\r
							*ngFor="let value of setting.setting.values"\r
							[ngValue]="value.value">\r
							{{ value.label }}\r
						</option>\r
					</select>\r
				</div>\r
\r
				<div *ngSwitchCase="'boolean'" class="field switch lm-padding-sm-t">\r
					<input\r
						[attr.id]="setting.settingName"\r
						type="checkbox"\r
						class="switch"\r
						[(ngModel)]="value" />\r
					<label class="label" [attr.for]="setting.settingName">{{\r
						setting.setting.label\r
					}}</label>\r
				</div>\r
\r
				<div *ngSwitchCase="getExternalType()" class="field">\r
					<button\r
						class="btn-primary lm-margin-lg-b lm-margin-sm-t"\r
						(click)="openExternalEditor()">\r
						Edit value\r
					</button>\r
				</div>\r
\r
				<div *ngSwitchCase="'intSelector'" class="field">\r
					<label class="label" [attr.for]="setting.settingName">{{\r
						setting.setting.label\r
					}}</label>\r
					<select\r
						soho-dropdown\r
						[name]="'lm-a-rule-edit-' + setting.settingName"\r
						[attributes]="{\r
							name: 'id',\r
							value: 'lm-a-rule-edit-' + setting.settingName\r
						}"\r
						[(ngModel)]="value"\r
						data-validate="required"\r
						required>\r
						<option *ngFor="let item of maxCountNumbers" [ngValue]="item">\r
							{{ item }}\r
						</option>\r
					</select>\r
				</div>\r
\r
				<div *ngSwitchCase="'int'" class="field">\r
					<label class="label e2e-rule-int" [attr.for]="setting.settingName">{{\r
						setting.setting.label\r
					}}</label>\r
					<input\r
						class="lm-left-text"\r
						[attr.id]="setting.settingName"\r
						[(ngModel)]="value"\r
						soho-input\r
						soho-mask\r
						process="number"\r
						sohoPattern="####" />\r
				</div>\r
\r
				<div *ngSwitchCase="'AdminContactInfo'" class="field">\r
					<label class="label" [attr.for]="setting.settingName">{{\r
						setting.setting.label\r
					}}</label>\r
					<textarea\r
						soho-textarea\r
						maxlength="512"\r
						[attr.id]="setting.settingName"\r
						[(ngModel)]="value"\r
						data-validate="required"\r
						required></textarea>\r
				</div>\r
\r
				<div *ngSwitchDefault class="field">\r
					<label\r
						class="label e2e-rule-default"\r
						[attr.for]="setting.settingName"\r
						>{{ setting.setting.label }}</label\r
					>\r
					<input\r
						[attr.id]="setting.settingName"\r
						type="text"\r
						[(ngModel)]="value"\r
						data-validate="required"\r
						required />\r
				</div>\r
			</div>\r
		</div>\r
\r
		<div class="column">\r
			<!-- Add User -->\r
			<div class="field">\r
				<label class="label" for="autocomplete-rules">Add user</label>\r
				<div class="searchfield-wrapper">\r
					<input\r
						soho-autocomplete\r
						placeholder="Search for users..."\r
						id="autocomplete-rules"\r
						[autoSelectFirstItem]="true"\r
						[attributes]="{\r
							name: 'name',\r
							value: 'lm-a-set-editrule-user-search'\r
						}"\r
						class="e2e-userSearch lm-autocomplete-searchfield"\r
						maxlength="64"\r
						[(ngModel)]="userInput"\r
						[source]="autocompleteUserSource"\r
						[template]="autocompleteUserTemplate"\r
						(selected)="\r
							!$event[1].hasClass('no-results')\r
								? onSelectAutocomplete($event[2])\r
								: null\r
						" />\r
					<svg\r
						class="icon"\r
						focusable="false"\r
						aria-hidden="true"\r
						role="presentation">\r
						<use xlink:href="#icon-search"></use>\r
					</svg>\r
				</div>\r
				<span *ngIf="existsMessage" class="label error lm-margin-md-b">{{\r
					existsMessage\r
				}}</span>\r
			</div>\r
\r
			<!-- Add Role -->\r
			<div class="compound-field lm-margin-xl-b">\r
				<div class="field lm-margin-zero-b">\r
					<label class="label" for="autocomplete-role">Add role</label>\r
					<div class="searchfield-wrapper">\r
						<input\r
							style="width: 155px"\r
							soho-autocomplete\r
							placeholder="Search for roles..."\r
							maxlength="64"\r
							id="autocomplete-role"\r
							[autoSelectFirstItem]="true"\r
							[attributes]="{\r
								name: 'name',\r
								value: 'lm-a-set-editrule-role-search'\r
							}"\r
							class="lm-autocomplete-searchfield"\r
							[(ngModel)]="roleInput"\r
							[source]="autocompleteRoleSource"\r
							[template]="autocompleteRoleTemplate"\r
							[filterMode]="autocompleteRoleFilterMode"\r
							(selected)="\r
								!$event[1].hasClass('no-results')\r
									? onSelectAutocomplete($event[2])\r
									: null\r
							" />\r
						<svg\r
							class="icon"\r
							focusable="false"\r
							aria-hidden="true"\r
							role="presentation">\r
							<use xlink:href="#icon-search"></use>\r
						</svg>\r
					</div>\r
				</div>\r
				<button\r
					class="btn-secondary"\r
					id="lm-a-sett-ar-ar"\r
					(click)="addRole()"\r
					[disabled]="!roleInput">\r
					Add Role\r
				</button>\r
				<span *ngIf="existsRoleMessage" class="label error">{{\r
					existsRoleMessage\r
				}}</span>\r
			</div>\r
\r
			<label for="affectedUsers" class="label" *ngIf="ruleConnections.length"\r
				>Added</label\r
			>\r
			<div class="listview lm-compact-list lm-max-height-l">\r
				<ul id="affectedUsers">\r
					<li\r
						*ngFor="let connection of ruleConnections"\r
						class="lm-cursor-default"\r
						soho-tooltip\r
						[title]="connection.info">\r
						<!-- orderBy:'connection.displayName' -->\r
						<p\r
							class="listview-heading lm-pull-left"\r
							[class.is-group]="!connection.isUser"\r
							name="lm-a-sett-rule-added-name">\r
							{{ connection.displayName }}\r
						</p>\r
						<button\r
							class="btn-icon"\r
							(click)="remove(connection)"\r
							soho-tooltip\r
							title="Remove"\r
							name="lm-a-sett-rule-added-remove">\r
							<svg class="icon icon-close" aria-hidden="true" focusable="false">\r
								<use xlink:href="#icon-close" />\r
							</svg>\r
							<span class="audible">Remove</span>\r
						</button>\r
					</li>\r
				</ul>\r
			</div>\r
		</div>\r
	</div>\r
\r
	<!-- Modal buttons -->\r
	<div class="modal-buttonset">\r
		<button class="btn-modal" id="lm-a-sett-ar-c" (click)="dialog?.close()">\r
			Cancel\r
		</button>\r
		<button class="btn-modal-primary" id="lm-a-sett-ar-s" (click)="onOk()">\r
			{{ primaryButtonLabel }}\r
		</button>\r
	</div>\r
</div>\r
`;var il=`.lm-setting-dialog{display:flex}.lm-setting-dialog>div{width:50%;margin-left:0}.lm-setting-dialog>div:first-child{padding-right:30px;border-right:1px solid #e5e5e5}.lm-setting-dialog>div:nth-child(2){padding-left:30px}.lm-setting-dialog .lm-compact-list{min-width:300px}.lm-admin-dialog-height{height:400px}.lm-admin-dialog-width{width:700px}#affectedUsers li button{float:right}html[dir=rtl] :host #affectedUsers li button{float:left}
/*# sourceMappingURL=rule.css.map */
`;var sl=`\uFEFF<div\r
	#defaultPagesView\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
			<span soho-toolbar-section-title id="lm-a-set-es-h">Default pages</span>\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-set-es-ap"\r
				icon="add"\r
				data-action="openPageSelector">\r
				Add Pages\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title" id="lm-a-set-es-tb-h">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-set-es-tb-d"\r
				icon="delete"\r
				(click)="deletePages()">\r
				Delete ({{ selectionCount }})\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#defaultPagesGrid\r
		soho-datagrid\r
		(selected)="updateSelection($event.rows)"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(cellchange)="updateValue()"\r
		(rowReordered)="onRowReordered($event)"\r
		(expandrow)="onExpandRow($event)"></div>\r
</div>\r
`;var _i,Vi=(_i=class extends q{constructor(e,t,i,s,a,o,n){super(e,"page",t,i,s,a,o),this.messageService=t,this.languageService=i,this.adminService=s,this.sohoModalDialogService=a,this.zone=o,this.settingsService=n,this.maxPages=20}ngOnInit(){this.initGrid(),this.listItems(),this.settingsService.isDynamicPagesEnabled$.pipe(he(1)).subscribe(e=>this.isDynamicPagesEnabled=e)}openPageSelector(){if(!this.canAddPage()||this.isDialogOpen)return;this.isDialogOpen=!0,this.isBusy=!0;let e=this.createSelectorOptions();this.adminService.openPageSelectorDialog(e,"Add Pages",this.getView(),null).pipe(rt(()=>{this.isDialogOpen=!1,this.isBusy=!1})).subscribe(i=>{let s=i.value;s&&i.button===C.Ok&&(this.addPages(s),this.updateValue())})}onExpandRow(e){let t=e.item,i=$(e.detail).find(".datagrid-row-detail-padding").empty(),s=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${oe.escapeStringForHtml(t.description)}</span>`;t.err&&t.err.pageError===_t.DynamicPagesFeatureOff&&(s+=this.getErrorMessageTemplate(fe.formatAlert(I.dynPageFeatureOffMsg,!0))),s+="</div>",$(i).append($(s))}onRowReordered(e){this.updateValue()}listItems(){let e=this.toItems(this.settingItem.value);if(e.length===0)return;let t=e.map(i=>i.info.id).join(",");this.isBusy=!0,this.adminService.getPageSettingInfo(t).subscribe(i=>{let s=i.content;this.initItems(e,s),this.setBusy(!1)},()=>{this.showPageLoadError(),this.initItems(e,[]),this.setBusy(!1)})}deletePages(){let e=this.selection;if(!e)return;let t=this.items.slice();for(let i of e)u.remove(t,i.data);this.getDataGrid().unSelectAllRows(),this.count=t.length,this.updateItems(t),this.updateValue()}getPageError(e){return e.isDynamic&&!this.isDynamicPagesEnabled?{message:I.dynPageFeatureOffMsg,pageError:_t.DynamicPagesFeatureOff}:null}toItems(e){let t=this.toInfos(e),i=[],s=1;for(let a of t)i.push(this.toItem(a,s)),s++;return i}initItems(e,t){for(let i of e){let s=i.info.id,a=u.itemByPredicate(t,o=>o.id===s);a?(i.title=a.title||"Missing page ("+s+")",i.description=a.description,i.accessState=a.accessState,i.isDynamic=a.isDynamic,i.err=this.getPageError(a)):(i.title=i.info.id,i.description="")}this.count=e.length,this.updateItems(e)}addPages(e){if(!e)return;let t=this.items.slice(),i=t.length+1;for(let a of e){let o=a.data;u.indexByPredicate(t,n=>n.info.id===o.id)<0&&(t.push(this.createItem(a,i)),i++)}let s=this.maxPages;t.length>s&&(t=t.slice(0,s),this.showMaxCountMessage()),this.count=t.length,this.updateItems(t)}canAddPage(){return this.count>=this.maxPages?(this.showMaxCountMessage(),!1):!0}showMaxCountMessage(){this.showError("Maximum number of pages reached","The maximum number of pages is "+this.maxPages)}showPageLoadError(){this.showError("Unable to load page titles","Page IDs are shown instead of titles.")}getRowReorderColumn(){return{width:80,id:"rowReorder",field:"id",align:"center",sortable:!1,formatter:Formatters.RowReorder}}},_i.ctorParameters=()=>[{type:String},{type:b},{type:L},{type:y},{type:w},{type:B},{type:be}],_i.propDecorators={settingItem:[{type:h}],dialog:[{type:h}]},_i);Vi=d([Ue()],Vi);var Zi,Qt=(Zi=class extends Vi{constructor(e,t,i,s,a,o){super("DefaultPagesComponent",e,t,i,s,a,o),this.messageService=e,this.languageService=t,this.adminService=i,this.sohoModalDialogService=s,this.zone=a,this.settingsService=o}updateValue(){let e=this.items,t=[];for(let s of e)if(s){let a=s.info;a.type=parseInt(s.type),t.push(a)}let i={pages:t};this.settingItem.value=JSON.stringify(i)}getDataGrid(){return this.datagrid}getView(){return this.view}createItem(e){let t=e.data;return{id:t.id,info:this.createInfo(t.id),title:t.title,description:t.description,type:t.isDynamic?Gn.Role.toString():Gn.Owner.toString(),isDynamic:t.isDynamic,accessState:e.accessState,err:this.getPageError(t)}}createSelectorOptions(){return{title:this.settingItem.setting.label,isMultiSelect:!0,excludeDynamic:!1,noShowIds:this.items.map(e=>e.info.id)}}getCount(){return this.items.length}initGrid(){let e='<div class="datagrid-cell-layout" style="overflow: hidden;"><span class="datagrid-textarea lm-white-space-normal">{{description}}</span></div>',t=i=>{let s=this.items[i];return!(s&&s.isDynamic)};this.datagridOptions={idProperty:"id",rowTemplate:e,rowReorder:!0,selectable:"multiple",editable:!0,filterable:!1,disableRowDeactivation:!0,clickToSelect:!1,columns:[this.getRowReorderColumn(),this.getSelectionColumn(),{width:500,id:"adm-dp-col-title",field:"title",name:"Title",resizable:!0,sortable:!1,formatter:S.dynamicDisabledExpander},{width:150,id:"adm-dp-col-type",field:"type",name:"Type",align:"center",resizable:!1,sortable:!1,formatter:Formatters.Dropdown,editor:Soho.Editors.Dropdown,isEditable:t,options:[{label:"Private",value:"0"},{label:"Published",value:"100"}]},{width:150,id:"adm-dp-col-permissions",field:"accessState",name:"Permissions",resizable:!0,sortable:!1,formatter:S.accessState}],dataset:this.items,emptyMessage:{title:"No default pages configured. Click 'Add Pages' to configure default pages.",icon:I.adminEmptyDatagridIcon}}}toItem(e,t){return{id:t,title:e.id,info:e,type:`${e.type}`}}toInfos(e){if(e)if(e.indexOf("{")>=0){let t=JSON.parse(e);if(t&&t.pages)return t.pages}else return e.split(",").map(t=>this.createInfo(t));return[]}createInfo(e){return{id:e,type:0}}},Zi.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:be}],Zi.propDecorators={view:[{type:f,args:["defaultPagesView",{read:A,static:!1}]}],datagrid:[{type:f,args:["defaultPagesGrid",{static:!1}]}]},Zi);Qt=d([p({selector:"lm-admin-default-pages",template:sl})],Qt);var al=`\uFEFF<div\r
	#mandatoryPagesView\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div class="field">\r
		<input\r
			id="lm-a-mp-f"\r
			class="checkbox"\r
			type="checkbox"\r
			[(ngModel)]="isFirst"\r
			(ngModelChange)="updateValue()" />\r
		<label class="checkbox-label" for="lm-a-mp-f"\r
			>Use the first permitted page only</label\r
		>\r
	</div>\r
\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
			Mandatory pages\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button soho-button="tertiary" icon="add" data-action="openPageSelector">\r
				Add Pages\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				[disabled]="selectionCount !== 1"\r
				(click)="setDateRange(selected)">\r
				Set Date Range\r
			</button>\r
			<button soho-button="tertiary" icon="delete" (click)="deletePages()">\r
				Delete ({{ selectionCount }})\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#mandatoryPagesGrid\r
		soho-datagrid\r
		(selected)="updateSelection($event.rows)"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(cellchange)="updateValue()"\r
		(rowReordered)="onRowReordered($event)"\r
		(expandrow)="onExpandRow($event)"></div>\r
</div>\r
`;var Hn=class Hn{static format(e){let t=e.fromDate||0,s=(e.toDate||0)>0,a=t>0;return!e.status&&!(a||s)?"":this.getTemplate(e)}static getTemplate(e){let t=this.calculateStatus(e),i,s="";switch(t){case Qe.Future:i=e.isFutureMessage;break;case Qe.Active:i=e.isActiveMessage,s="icon-success";break;case Qe.ActiveBeforeExpire:i=e.isActiveCloseExpireMessage,s="icon-alert";break;case Qe.Expired:i=e.isExpiredMessage,s="icon-error";break}let a=e.iconName||"clock";return`
			<div title="${i}" class="lm-text-align-c">
				<svg class="icon datagrid-alert-icon ${s}" focusable="false" aria-hidden="true" role="presentation">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${a}"/>
				</svg>
				<span class="audible">${i}</span>
			</div>
		`}static calculateStatus(e){if(e.status)return e.status;let t=e.fromDate||0,i=e.toDate||0,s=i>0,a=new Date().getTime(),o=a>t;if(s&&a>i)return Qe.Expired;if(o){let r=!!e.isActiveCloseExpireMessage,l=!1;if(r){let c=e.closeToEndLimitMilliSeconds>0?e.closeToEndLimitMilliSeconds:this.alertLimitMilliSeconds;l=s&&i-a<c}return r&&l?Qe.ActiveBeforeExpire:Qe.Active}else return Qe.Future}};Hn.alertLimitMilliSeconds=432e5;var Xt=Hn,Jt=class Jt{};Jt.Unknown=0,Jt.Future=1,Jt.Active=2,Jt.ActiveBeforeExpire=3,Jt.Expired=4;var Qe=Jt;var de=class m{static parseToString(e){return e?m.dateToString(new Date(e)):""}static dateToString(e){let t={date:"datetime"};try{Soho.Locale.isIslamic()&&(t.fromGregorian=!0)}catch(i){Oe.warning("Soho.Locale.isIslamic() is no longer available. Date will not be formatted correctly.",i)}return Soho.Locale.formatDate(e,t)}static parseLocaleDate(e){if(!e)return new Date;let t=Soho.Locale.calendar().dateFormat.datetime,i=Soho.Locale.parseDate(e,t,!0),s=i;if(Array.isArray(i))try{s=Soho.Locale.umalquraToGregorian(s)}catch(a){Oe.warning("Soho.Locale.umalquraToGregorian() is no longer available. Date will not be parsed correctly.",a)}return s}static today(){let e=new Date;return e.setHours(0,0),e}static weekFromNow(){let e=m.today(),t=7*24*60*60*1e3;return e.setTime(e.getTime()+t-6e4),e}};var ol=`\uFEFF<div>\r
	<div class="field">\r
		<label for="from" class="label">Available from</label>\r
		<input\r
			style="width: 300px"\r
			soho-datepicker\r
			[attributes]="{ name: 'name', value: 'lm-a-daterange-from' }"\r
			showTime="true"\r
			mode="standard"\r
			minuteInterval="1"\r
			[(ngModel)]="from" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="to" class="label">Available to</label>\r
		<input\r
			style="width: 300px"\r
			soho-datepicker\r
			[attributes]="{ name: 'name', value: 'lm-a-daterange-to' }"\r
			showTime="true"\r
			mode="standard"\r
			minuteInterval="1"\r
			[(ngModel)]="to" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="timezone" class="label">Time zone</label>\r
		<select\r
			style="width: 300px"\r
			soho-dropdown\r
			name="lm-a-daterange-dialog-timezone"\r
			[attributes]="{ name: 'id', value: 'lm-a-daterange-dialog-timezone' }"\r
			[(ngModel)]="timeZone">\r
			<option *ngFor="let zone of timeZones" [ngValue]="zone.id">\r
				{{ zone.name }}\r
			</option>\r
		</select>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			(click)="cancel()"\r
			id="lm-a-daterange-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			(click)="save()"\r
			id="lm-a-daterange-dialog-save">\r
			Save\r
		</button>\r
	</div>\r
</div>\r
`;var Ea,Kt=(Ea=class extends J{constructor(e,t,i){super("DateRangeComponent",e),this.contextService=t,this.adminService=i,this.timeZones=E.getTimeZones()}ngOnInit(){this.initModalDialog();let e=this.dateRange.from,t=this.dateRange.to;!t&&!e?(this.from=de.dateToString(de.today()),this.to=de.dateToString(de.weekFromNow())):(this.from=de.parseToString(e),this.to=de.parseToString(t)),this.timeZone=this.dateRange.tz||this.contextService.getContext().getInforStdTimeZone()||"UTC"}save(){if(this.timeZone||this.showInvalidRangeError("A time zone must be selected."),!this.dateRange.from&&!this.dateRange.to){this.modalDialog.close({button:C.Ok,value:null});return}this.setCanClose(!1),this.adminService.validateDateRange([this.dateRange]).subscribe(e=>{if(e&&e.content&&e.content[0]){let t=e.content&&e.content[0];this.dateRange.sts=t.sts,this.setCanClose(!0),this.modalDialog.close({button:C.Ok,value:this.dateRange})}},e=>{if(e.hasError()){this.showInvalidRangeError(e.getErrorMessages());return}else this.adminService.handleError(e)})}showInvalidRangeError(e){this.showError("Date range",e)}get timeZone(){return this.dateRange.tz}set timeZone(e){this.dateRange.tz=e}get from(){return de.parseToString(this.dateRange.from)}set from(e){this.dateRange.from=e?this.dateToFromIds(e):null}get to(){return de.parseToString(this.dateRange.to)}set to(e){this.dateRange.to=e?this.dateToFromIds(e):null}dateToFromIds(e){let t=de.parseLocaleDate(e);return E.toIsoDateTimeLocal(t)}},Ea.ctorParameters=()=>[{type:b},{type:ct},{type:y}],Ea);Kt=d([p({template:ol})],Kt);var Sn=class Sn{static format(e,t,i,s,a,o){let n=a.info,r=n.from,l=n.to,c=n.dateRange?n.dateRange.sts:null;return Xt.format({closeToEndLimitMilliSeconds:Sn.alertLimitMilliSeconds,fromDate:r,toDate:l,status:c,isFutureMessage:"Page is not yet active",isActiveCloseExpireMessage:"Page expires soon",isActiveMessage:"Page is active",isExpiredMessage:"Page has expired"})}};Sn.alertLimitMilliSeconds=864e5;var qn=Sn,ji,ei=(ji=class extends Vi{constructor(e,t,i,s,a,o,n){super("MandatoryPagesComponent",e,t,i,s,a,o),this.messageService=e,this.languageService=t,this.adminService=i,this.sohoModalDialogService=s,this.zone=a,this.settingsService=o,this.contextService=n}setDateRange(e){let t=e.info,i=v.copy(t.dateRange),s=this.sohoModalDialogService.modal(Kt,this.view).title("Set date range").id("lm-a-daterange-dialog").afterClose(a=>{if(a&&a.button===C.Ok){let o=a.value;t.dateRange=o,this.updateValue(),this.refreshItems()}});s.apply(a=>{a.modalDialog=s,a.dateRange=i}).open()}updateValue(){let e=[];for(let i of this.items)if(i){let s=i.info;s.primary=i.primary,e.push(s)}let t={pages:e};this.isFirst&&(t.strategy=1),this.settingItem.value=JSON.stringify(t)}getView(){return this.view}getDataGrid(){return this.datagrid}createItem(e,t){let i=e.data;return{id:t,info:this.createInfo(i.id),title:i.title,description:i.description,primary:!1,accessState:e.accessState,err:this.getPageError(i)}}createSelectorOptions(){return{title:this.settingItem.setting.label,isMultiSelect:!0,noShowIds:this.items.map(e=>e.info.id)}}initGrid(){let e='<div class="datagrid-cell-layout" style="overflow: hidden;"><span class="datagrid-textarea lm-white-space-normal">{{description}}</span></div>';this.datagridOptions={idProperty:"id",rowTemplate:e,rowReorder:!0,selectable:"multiple",editable:!0,filterable:!1,disableRowDeactivation:!0,clickToSelect:!1,columns:[this.getRowReorderColumn(),this.getSelectionColumn(),{width:77,id:"adm-mp-col-range",field:"range",align:"center",name:"Status",resizable:!1,sortable:!1,formatter:qn.format},{width:500,id:"adm-mp-col-title",field:"title",name:"Title",resizable:!0,sortable:!1,formatter:S.dynamicDisabledExpander},{width:100,id:"adm-mp-col-primary",field:"primary",name:"Primary",align:"center",resizable:!1,sortable:!1,formatter:Formatters.Checkbox,editor:Soho.Editors.Checkbox},{width:150,id:"adm-mp-col-permissions",field:"accessState",name:"Permissions",resizable:!0,sortable:!1,formatter:S.accessState}],dataset:this.items,emptyMessage:{title:"No mandatory pages configured. Click 'Add Pages' to configure mandatory pages.",icon:I.adminEmptyDatagridIcon}}}toItem(e,t){return{id:t,title:e.id,info:e,primary:!!e.primary}}toInfos(e){if(e)if(e.indexOf("{")>=0){let t=v.tryParse(e);if(t){this.isFirst=t.strategy===1;let i=t.pages;if(i)return this.convertLegacyDate(i),this.evaluateDateRangeStatus(i),i}}else return e.split(",").map(t=>this.createInfo(t));return[]}refreshItems(){this.updateItems(this.items.slice())}createInfo(e){return{id:e,dateRange:this.getDefaultDateRange(),primary:!1}}evaluateDateRangeStatus(e){let t=e.filter(i=>i.dateRange).map(i=>i.dateRange).filter(i=>i.from||i.to);this.adminService.getDateRangeStatus(t).subscribe(i=>{let s=i?i.content:null;if(s&&s.length===t.length)for(let a of t)a.sts=s.shift().sts},()=>{for(let i of t)i.sts=0})}convertLegacyDate(e){for(let t of e)(t.from||t.to)&&!t.dateRange&&(t.dateRange=this.getDefaultDateRange()),t.from&&(t.dateRange.from=E.toIsoDateTimeLocal(new Date(t.from)),t.from=0),t.to&&(t.dateRange.to=E.toIsoDateTimeLocal(new Date(t.to)),t.to=0)}getDefaultDateRange(){return{from:null,to:null,tz:this.contextService.getContext().getInforStdTimeZone()||"UTC"}}},ji.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:be},{type:ct}],ji.propDecorators={view:[{type:f,args:["mandatoryPagesView",{read:A,static:!1}]}],datagrid:[{type:f,args:["mandatoryPagesGrid",{static:!1}]}]},ji);ei=d([p({selector:"lm-admin-mandatory-pages",template:al})],ei);var Yi,ti=(Yi=class extends R{get primaryButtonLabel(){return this.isEdit?"Ok":"Add"}constructor(e,t,i){super("SettingAddEditRuleComponent"),this.sohoModalDialogService=e,this.adminService=t,this.commonDataService=i,this.isEdit=!1,this.ruleConnections=[],this.maxCountNumbers=[],this.existsMessage="",this.existsRoleMessage="",this.initAutocomplete()}ngOnInit(){let e=ve,t=this.parameter;this.userName=t.userName;let i=v.copy(t.setting);this.setting=i;let s=t.rule?v.copy(t.rule):t.rule;if(this.rule=s,this.pages=v.copy(t.pages),W.isUndefined(s)?i.settingName===K.logLevel&&(this.value=i.value):(this.value=s.value,this.ruleName=s.name,this.ruleConnections=s.ruleConnections||[],this.isEdit=!0,this.originalValue=s.value),i.type===e.typeBool&&!this.isEdit&&(this.value=!1),i.type===e.typeIntSelector){let a=0;for(;a<t.maxCount;){let o=(a+1).toString();this.maxCountNumbers.push(o),a++}}}getExternalType(){let e=this.setting.type;return e===ve.typeDefaultPages||e===ve.typeMandatoryPages?e:""}onSelectAutocomplete(e){W.isUndefined(e)||W.isUndefined(e.value)||this.addEntity(e.value,e.type,e.label,e.info)}addRole(){let e=this.roleInput;e&&this.addEntity(e,we.Role,null,null)}onOk(){if(!this.ruleName)return;let e=this.setting;this.isEdit?this.editRule():this.addRule(),this.dialog.close({value:e})}remove(e){let t=this.ruleConnections,i=t.indexOf(e);t.splice(i,1)}openExternalEditor(){let e,t=v.copy(this.setting),i=t.type;t.value=this.value||"",i===ve.typeDefaultPages?e=this.openExternalDialog(t,Qt):i===ve.typeMandatoryPages&&(e=this.openExternalDialog(t,ei)),e&&e.subscribe(s=>{s&&s.button===C.Ok&&(this.value=s.value)})}initAutocomplete(){let e=this;this.autocompleteUserSource=new st(t=>e.commonDataService.searchUsers(t),t=>v.getEntityArray(we.User,t.content),e.commonDataService).source,this.autocompleteUserTemplate=Re.autocompleteEntity,this.autocompleteRoleSource=new st(t=>e.adminService.searchRoles(t),t=>u.sortByProperty(t,"label"),e.commonDataService).source,this.autocompleteRoleTemplate=Re.autocompleteEntity,this.autocompleteRoleFilterMode="contains"}addEntity(e,t,i,s){this.existsMessage="",this.existsRoleMessage="";let a=t===we.User,o={name:e,isUser:a,displayName:i||e,info:s||e},n=Le.hasConnection(this.ruleConnections,o),r=Le.isSameConnection(o,this.lastConnection);if(this.lastConnection=o,n){r||(a?this.existsMessage="User already added":this.existsRoleMessage="Role already added");return}this.ruleConnections.push(o),o.isUser||(this.roleInput="")}addRule(){let e=this.userName,t=this.ruleConnections;t.forEach(o=>{o.displayChangeDate=E.getPendingChangeDate(),o.changedByName=e});let i=this.setting;this.value=this.changeInvalidValue(i,this.value);let s=Le.getDisplayValue(i,this.value),a={name:this.ruleName,sortOrder:1,affectedUsers:t.length,value:this.value,displayValue:s,isChanged:!0,ruleConnections:t,displayChangeDate:E.getPendingChangeDate(),changedByName:e,changeDate:null,changedBy:null,mode:null,module:null,readOnly:null,ruleSettingId:null,settingName:i.setting.settingName};i.rules.forEach(o=>{o.sortOrder++,o.isChanged=!0,o.changedByName=e,o.displayChangeDate=E.getPendingChangeDate()}),i.rules.unshift(a)}editRule(){let e=this.rule,t=this.ruleConnections,i=this.userName;t.forEach(n=>{n.displayChangeDate=E.getPendingChangeDate(),n.changedByName=i});let s=this.setting,a=u.indexByProperty(s.rules,"sortOrder",e.sortOrder);this.value=this.changeInvalidValue(s,this.value);let o=Le.getDisplayValue(s,this.value);e.name=this.ruleName,e.value=this.value,e.displayValue=o,e.affectedUsers=t.length,e.isChanged=!0,e.ruleConnections=t,e.displayChangeDate=E.getPendingChangeDate(),e.changedByName=i,a!==-1&&(this.setting.rules[a]=e)}changeInvalidValue(e,t){let i=ve;return e.type===i.typeIntSelector&&!Tt.isNumber(t)?this.originalValue?this.originalValue:0:t}openExternalDialog(e,t){let i=new Ee,s=!1,a,o=[{text:"Cancel",id:"lm-a-set-r-edit-dialog-cancel",click:(r,l)=>{l.close()}},{text:"OK",id:"lm-a-set-r-edit-dialog-ok",click:(r,l)=>{s=!0,l.close()},isDefault:!0}],n=this.sohoModalDialogService.modal(t,this.ruleDialogView).title("Edit Setting").id("lm-a-set-r-edit-dialog").buttons(o).afterClose(()=>{let r={};s&&(r.button=C.Ok,r.value=a.settingItem.value),i.next(r),i.complete()});return n.apply(r=>{a=r,r.dialog=n,r.settingItem=e}).open(),i.asObservable()}},Yi.ctorParameters=()=>[{type:w},{type:y},{type:xe}],Yi.propDecorators={ruleDialogView:[{type:f,args:["ruleDialogView",{read:A,static:!1}]}]},Yi);ti=d([p({template:tl,styles:[il]})],ti);var nl=`\uFEFF<div>\r
	<div class="field" *ngIf="isUser">\r
		<label for="autocomplete-add-connection" class="label required"\r
			>User Search</label\r
		>\r
		<div class="searchfield-wrapper">\r
			<input\r
				soho-autocomplete\r
				placeholder="Search for users..."\r
				id="autocomplete-add-connection"\r
				[autoSelectFirstItem]="true"\r
				[attributes]="{ name: 'name', value: 'lm-a-set-rule-adduser-search' }"\r
				maxlength="64"\r
				class="lm-autocomplete-searchfield"\r
				(selected)="\r
					!$event[1].hasClass('no-results')\r
						? onSelectAutocomplete($event[2])\r
						: null\r
				"\r
				[source]="autocompleteUserSource"\r
				[template]="autocompleteUserTemplate" />\r
			<svg\r
				class="icon"\r
				focusable="false"\r
				aria-hidden="true"\r
				role="presentation">\r
				<use xlink:href="#icon-search"></use>\r
			</svg>\r
		</div>\r
		<span *ngIf="existsMessage.length > 0" class="label error lm-margin-md-b">{{\r
			existsMessage\r
		}}</span>\r
	</div>\r
\r
	<div class="field" *ngIf="!isUser">\r
		<label for="add-connection-role" class="label required">Role</label>\r
		<div class="searchfield-wrapper">\r
			<input\r
				soho-autocomplete\r
				placeholder="Search for roles..."\r
				id="add-connection-role"\r
				[autoSelectFirstItem]="true"\r
				[attributes]="{ name: 'name', value: 'lm-a-set-rule-addrole-search' }"\r
				maxlength="64"\r
				class="lm-autocomplete-searchfield"\r
				[(ngModel)]="roleInput"\r
				(selected)="\r
					!$event[1].hasClass('no-results')\r
						? onSelectAutocomplete($event[2])\r
						: null\r
				"\r
				[source]="autocompleteRoleSource"\r
				[template]="autocompleteRoleTemplate"\r
				[filterMode]="autocompleteRoleFilterMode" />\r
			<svg\r
				class="icon"\r
				focusable="false"\r
				aria-hidden="true"\r
				role="presentation">\r
				<use xlink:href="#icon-search"></use>\r
			</svg>\r
		</div>\r
		<span *ngIf="existsMessage.length > 0" class="label error lm-margin-md-b">{{\r
			existsMessage\r
		}}</span>\r
	</div>\r
\r
	<button\r
		*ngIf="!isUser"\r
		class="btn-secondary lm-margin-xl-b"\r
		(click)="addRole()"\r
		[disabled]="!roleInput"\r
		name="lm-add-connection-addrole">\r
		Add Role\r
	</button>\r
\r
	<div class="field" *ngIf="ruleConnections.length > 0">\r
		<label class="label">To be added</label>\r
		<div class="listview lm-compact-list lm-max-height-l">\r
			<ul>\r
				<li\r
					*ngFor="let connection of ruleConnections"\r
					class="lm-cursor-default"\r
					soho-tooltip\r
					[title]="connection.info">\r
					<!-- orderBy:'connection.displayName' -->\r
					<p\r
						class="listview-heading lm-pull-left"\r
						[class.is-group]="!connection.isUser"\r
						name="lm-a-set-userrole-added-name">\r
						{{ connection.displayName }}\r
					</p>\r
					<div class="lm-pull-right">\r
						<button\r
							class="btn-icon"\r
							(click)="remove(connection)"\r
							soho-tooltip\r
							title="Remove"\r
							name="lm-a-set-userrole-added-remove">\r
							<svg class="icon icon-close" aria-hidden="true" focusable="false">\r
								<use xlink:href="#icon-close" />\r
							</svg>\r
							<span>Remove</span>\r
						</button>\r
					</div>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal"\r
			(click)="dialog?.close()"\r
			id="lm-a-set-userrole-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			class="btn-modal-primary"\r
			[disabled]="ruleConnections.length === 0"\r
			(click)="onOk()"\r
			id="lm-a-set-userrole-dialog-Add">\r
			Add\r
		</button>\r
	</div>\r
</div>\r
`;var Ta,ii=(Ta=class extends R{constructor(e,t){super("RuleAddConnectionComponent"),this.adminService=e,this.commonDataService=t,this.ruleConnections=[],this.existsMessage="",this.initAutocomplete()}ngOnInit(){let e=this.parameter;this.rule=v.copy(e.rule),this.userName=e.userName,this.isUser=e.isUser}onOk(){if(this.ruleConnections.length>0){this.addConnections();let e={button:C.Ok,value:{rule:this.rule,displayChangeDate:E.getPendingChangeDate(),changedBy:this.userName}};this.dialog.close(e)}else this.dialog.close()}onSelectAutocomplete(e){if(W.isUndefined(e)||W.isUndefined(e.value))return;let t=e.value,s=e.type===we.User,a={name:t,isUser:s,displayName:e.label?e.label:t,info:e.info||t},o=this.isExisting(a),n=Le.isSameConnection(a,this.lastConnection);if(this.lastConnection=a,o){n||(this.existsMessage=s?"User already added":"Role already added");return}this.addConnection(a)}addRole(){let e=this.roleInput,t={name:e,isUser:!1,displayName:e,info:e};if(this.isExisting(t)){this.existsMessage="Role already added";return}this.addConnection(t)}remove(e){let t=this.ruleConnections,i=t.indexOf(e);t.splice(i,1)}addConnection(e){this.existsMessage="",this.roleInput="",this.ruleConnections.push(e)}isExisting(e){return Le.hasConnection(this.ruleConnections,e)||Le.hasConnection(this.rule.ruleConnections,e)}initAutocomplete(){let e=this;this.autocompleteUserSource=new st(t=>e.commonDataService.searchUsers(t),t=>u.sortByProperty(v.getEntityArray(we.User,t.content),"label"),e.commonDataService).source,this.autocompleteUserTemplate=Re.autocompleteEntity,this.autocompleteRoleSource=new st(t=>e.adminService.searchRoles(t),t=>u.sortByProperty(t,"label"),e.commonDataService).source,this.autocompleteRoleTemplate=Re.autocompleteEntity,this.autocompleteRoleFilterMode="contains"}addConnections(){this.ruleConnections.forEach(e=>{e.displayChangeDate=E.getPendingChangeDate(),e.changedByName=this.userName,this.rule.ruleConnections.push(e)})}},Ta.ctorParameters=()=>[{type:y},{type:xe}],Ta);ii=d([p({template:nl})],ii);var rl=`\uFEFF<div\r
	#setValueView\r
	id="e2e-set-value"\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div *ngIf="item" [ngSwitch]="item.type">\r
		<div *ngSwitchCase="'selector'" class="field">\r
			<label\r
				[attr.name]="'lm-a-set-edit-' + item.setting.settingName + '-label'"\r
				class="label"\r
				[attr.for]="'select-' + item.setting.settingName"\r
				>{{ item.setting.label }}</label\r
			>\r
			<select\r
				soho-dropdown\r
				noSearch\r
				[attr.id]="'select-' + item.setting.settingName"\r
				[attr.name]="'lm-a-set-edit-' + item.setting.settingName"\r
				[(ngModel)]="item.value"\r
				[attributes]="{\r
					name: 'id',\r
					value: 'lm-a-set-edit-' + item.setting.settingName\r
				}">\r
				<option\r
					*ngFor="let value of item.setting.values"\r
					[value]="value.value"\r
					[attr.name]="\r
						value.label\r
							| lmAutoId: 'lm-a-set-edit-' + item.setting.settingName : 'value'\r
					">\r
					{{ value.label }}\r
				</option>\r
			</select>\r
		</div>\r
\r
		<div *ngSwitchCase="'boolean'" class="field switch lm-padding-sm-t">\r
			<input\r
				[attr.id]="item.settingName"\r
				type="checkbox"\r
				class="switch"\r
				[(ngModel)]="item.value" />\r
			<label class="label" [attr.for]="item.settingName">{{\r
				item.setting.label\r
			}}</label>\r
		</div>\r
\r
		<div *ngSwitchCase="'defaultPages'">\r
			<lm-admin-default-pages\r
				[settingItem]="item"\r
				[dialog]="dialog"></lm-admin-default-pages>\r
		</div>\r
\r
		<div *ngSwitchCase="'mandatoryPages'">\r
			<lm-admin-mandatory-pages\r
				[settingItem]="item"\r
				[dialog]="dialog"></lm-admin-mandatory-pages>\r
		</div>\r
\r
		<div *ngSwitchCase="'intSelector'" class="field">\r
			<label class="label" [attr.for]="item.settingName">{{\r
				item.setting.label\r
			}}</label>\r
\r
			<select\r
				soho-dropdown\r
				[attributes]="{\r
					name: 'id',\r
					value: 'lm-a-set-edit-' + item.setting.settingName\r
				}"\r
				[name]="'lm-a-set-edit-' + item.setting.settingName"\r
				[(ngModel)]="item.value"\r
				*ngIf="maxCountNumbers && maxCountNumbers.length > 0"\r
				data-validate="required"\r
				required>\r
				<option *ngFor="let value of maxCountNumbers" [value]="value">\r
					{{ value }}\r
				</option>\r
			</select>\r
		</div>\r
\r
		<div *ngSwitchCase="'int'" class="field">\r
			<label class="label" [attr.for]="item.settingName">{{\r
				item.setting.label\r
			}}</label>\r
			<input\r
				class="lm-left-text"\r
				[attr.id]="item.settingName"\r
				soho-input\r
				soho-mask\r
				process="number"\r
				sohoPattern="####"\r
				[(ngModel)]="item.value" />\r
		</div>\r
\r
		<div *ngSwitchCase="'AdminContactInfo'" class="field">\r
			<label class="label" [attr.for]="item.settingName">{{\r
				item.setting.label\r
			}}</label>\r
			<textarea\r
				soho-textarea\r
				maxlength="512"\r
				[attr.id]="item.settingName"\r
				[(ngModel)]="item.value"\r
				data-validate="required"\r
				required></textarea>\r
		</div>\r
\r
		<div *ngSwitchDefault class="field">\r
			<label class="label" [attr.for]="item.settingName">{{\r
				item.setting.label\r
			}}</label>\r
			<input\r
				[attr.id]="item.settingName"\r
				type="text"\r
				[(ngModel)]="item.value"\r
				data-validate="required"\r
				required />\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal"\r
			(click)="dialog?.close()"\r
			id="lm-a-set-edit-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			class="btn-modal-primary"\r
			(click)="onOk()"\r
			id="lm-a-set-edit-dialog-ok">\r
			OK\r
		</button>\r
	</div>\r
</div>\r
`;var Cn,Nt,si=(Nt=class extends R{constructor(e,t){super("SettingSetValueComponent",t),this.adminService=e,this.maxCountNumbers=[],this.isMultiple=!1}ngOnInit(){let e=v.copy(this.parameter.setting),t=e.value;this.originalValue=t,this.item=e;let i=ve;if(e.displayValue===t&&e.type!==i.typeString&&e.type!==i.typeInt&&e.type!==i.typeIntSelector&&e.type!==K.adminContactInfo&&(t=""),e.type===i.typeBool&&!t&&(t=!1),e.type===i.typeInt&&!t&&(t=1),this.item.value=t,e.type===i.typeIntSelector){let s=0;for(;s<this.parameter.maxCount;){let a=(s+1).toString();this.maxCountNumbers.push(a),s++}}}onOk(){let e=v.copy(this.item);e.changeDate=E.getPendingChangeDate(),e.changedByName=this.parameter.userName,e.setting.isChanged=!0;let t=e.value,i=ve;e.type===i.typeIntSelector&&!Tt.isNumber(t)&&(e.value=this.originalValue||1),e.displayValue=Le.getDisplayValue(e,e.value),this.dialog.close({value:e})}removePage(e){u.remove(this.item.value,e)}getPageIdString(e){if(!e)return"";if(e.indexOf("{")<0)return e;let t=JSON.parse(e);return!t||!t.pages?"":t.pages.map(i=>i.id).join(Cn.pageSeparator)}createPageValuesList(e,t){if(e){if(e.indexOf("{")<0){this.createPageValuesListLegacy(e,t);return}this.createPageValuesListJson(e,t)}}createPageValuesListJson(e,t){let s=JSON.parse(e).pages;if(!s)return;let a=[];for(let o of s){let n=o.id,r=t?u.find(t,l=>l.data.id===n):null;r?a.push(r):a.push(this.createDummyPage(n))}this.item.value=a}createPageValuesListLegacy(e,t){let i=e.split(Cn.pageSeparator),s=[];for(let a=0;a<i.length;a++){let o=i[a],n=t?u.find(t,r=>r.data.id===o):null;n?s.push(n):s.push(this.createDummyPage(o))}this.item.value=s}createDummyPage(e){return{data:{id:e,title:`Missing page (${e})`}}}},Cn=Nt,Nt.pageSeparator=",",Nt.ctorParameters=()=>[{type:y},{type:b}],Nt.propDecorators={setValueView:[{type:f,args:["setValueView",{read:A,static:!1}]}]},Nt);si=Cn=d([p({template:rl})],si);var $i,ai=($i=class extends R{constructor(e,t,i,s,a,o,n,r){super("AdminSettingsComponent",s),this.adminContext=e,this.adminService=t,this.dialogService=i,this.changeDetector=a,this.settingsService=o,this.settingsVisibilityPipe=n,this.settingsAreaPipe=r,this.isFeatureMode=!1,this.navState="",this.selectedSetting=null,this.selectedRule=null,this.settingAreas=[{name:M.allAreaName,value:M.allArea},{name:M.commonAreaName,value:M.commonArea},{name:M.pageAreaName,value:M.pageArea},{name:M.widgetAreaName,value:M.widgetArea}],this.settingsWithChangedRules=[],this.subscriptions=new nt}ngOnInit(){let e=this.subscriptions,t=i=>i.subscribe(s=>{this.items=s;let a=!this.visibleCount;this.visibleCount=this.items.filter(o=>o.setting.isVisible).length,a&&(this.hasTool=!0,this.initGridOptions(),this.isFeatureMode||this.selectArea(this.settingAreas[0])),this.listItems()});if(this.isFeatureMode){let i=t(this.settingsService.featureItems$);e.add(i)}else{let i=t(this.settingsService.settingItems$);e.add(i)}}ngOnDestroy(){this.subscriptions.unsubscribe(),$("#settingsgrid-actions-menu").remove()}areActionButtonsDisabled(){return!this.settingsService.isSettingsChanged&&!this.settingsService.isRulesChanged}selectArea(e){if(e){let t=this.getFilteredDataset(e);this.settingsGridOptions.dataset=t,this.settingsDatagrid&&this.settingsDatagrid.clearFilter(),this.updateFilterState()}this.selectedArea=e}getFilteredDataset(e){let t=e.value;return t===M.allArea&&(t=null),this.settingsVisibilityPipe.transform(this.settingsAreaPipe.transform(this.items,t))}listSettings(){this.navState="settings",this.selectedSetting=null,this.selectedRule=null,this.selectArea(this.selectedArea)}listFeatures(){this.selectedSetting=null,this.selectedRule=null,this.featuresGridOptions.dataset=this.items}listRules(e){this.navState="rules",W.isUndefined(e)||(this.selectedSetting=e);let t=this.selectedSetting,i=v.copy(t.rules);this.rulesGridOptions.dataset=i,this.rulesDatagrid&&(this.rulesDatagrid.setSortColumn("adm-sr-col-sorder",!0),this.rulesDatagrid.unSelectAllRows()),this.selectionCount=0}reload(){if(this.areActionButtonsDisabled())this.performReload();else{let e=this.dialogService.modal(oi,this.settingsView).title("Reload").id("lm-a-set-reload-dialog").afterClose(t=>{t&&t.button===C.Ok&&this.performReload()});e.apply(t=>{t.dialog=e}).open()}}deleteConnections(){let e=this.getSelectedItems(),t=this.selectedSetting.settingName,s=this.itemByProp(this.items,"settingName",t).rules,a=this.indexByProp(s,"sortOrder",this.selectedRule.sortOrder);e.forEach(o=>{let n=this.indexByProp(s[a].ruleConnections,"name",o.name);s[a].ruleConnections.splice(n,1)}),this.settingsWithChangedRules.indexOf(t)===-1&&this.settingsWithChangedRules.push(t),this.settingsService.isRulesChanged=!0,this.listConnections(s[a])}deleteRules(e){let t=e?[e]:this.getSelectedItems(),i=this.selectedSetting,s=i.rules;t.forEach(a=>{let o=this.indexByProp(s,"sortOrder",a.sortOrder);s.splice(o,1)}),s=u.sortByProperty(s,"sortOrder"),s.forEach((a,o)=>{a.sortOrder!==o+1&&(a.isChanged=!0,a.displayChangeDate=E.getPendingChangeDate(),a.changedByName=this.getTool().userName),a.sortOrder=o+1}),this.settingsWithChangedRules.indexOf(i.settingName)===-1&&this.settingsWithChangedRules.push(i.settingName),i.noOfRules=s.length,this.listRules(),this.settingsService.isRulesChanged=!0}save(){let e=new Ce;return this.setBusy(!0),this.settingsService.update(this.items,this.settingsWithChangedRules).subscribe(()=>{this.listItems(),e.next(),e.complete()},t=>{this.setBusy(!1),this.logDebug(`${t}`);let i="An error occured while updating the settings.";t&&t instanceof Error&&t.message&&(i=t.message),this.showError("Unable to save",i),e.error(t)},()=>this.setBusy(!1)),e.asObservable()}discard(){let e=this.dialogService.modal(oi,this.settingsView).title("Discard").id("lm-a-set-discard-dialog").afterClose(t=>{t&&t.button===C.Ok&&this.performDiscard()});e.apply(t=>{t.dialog=e}).open()}setSettingValue(e){if(this.isValueDialogOpen)return;this.isValueDialogOpen=!0,e&&(this.selectedSetting=e);let t=this.getTool(),i=this.selectedSetting,s={setting:i,userName:t.userName,maxCount:i.settingName===K.maxUserPageCount?t.maxCountPrivatePage:t.maxCountWidgetsOnPage,pages:null,widgets:null},a=this.dialogService.modal(si,this.settingsView).title("Edit Setting").id("lm-a-set-edit-dialog").afterClose(o=>{if(o&&o.value){let n=o.value;if(n.value===i.value){this.isValueDialogOpen=!1;return}let r=this.indexByProp(this.items,"settingName",this.selectedSetting.settingName);if(this.items[r]=n,this.isFeatureMode){let l=this.featuresDatagrid.dataset;r=this.indexByProp(l,"settingName",this.selectedSetting.settingName),l[r]=n,this.featuresDatagrid.dataset=l,this.settingsService.isSettingsChanged=!0}else{let l=this.settingsDatagrid.dataset;r=this.indexByProp(l,"settingName",this.selectedSetting.settingName),l[r]=n,this.settingsDatagrid.dataset=l,this.settingsService.isSettingsChanged=!0}this.changeDetector.detectChanges()}this.isValueDialogOpen=!1});a.apply(o=>{o.dialog=a,o.parameter=s}).open()}openAddOrEditRule(e){let t={setting:this.selectedSetting,rule:e,userName:this.getTool().userName,pages:[],maxCount:this.selectedSetting.settingName===K.maxUserPageCount?this.getTool().maxCountPrivatePage:this.getTool().maxCountWidgetsOnPage},i=this.dialogService.modal(ti,this.settingsView).title(W.isUndefined(e)?"Add Rule":"Edit Rule").id("lm-a-set-addrule-dialog").suppressEnterKey(!0).afterClose(s=>{if(s&&s.value){let a=this.itemByProp(this.items,"settingName",this.selectedSetting.settingName);a.rules=s.value.rules,a.noOfRules=s.value.rules.length,a.changeDate=E.getPendingChangeDate(),this.settingsWithChangedRules.indexOf(a.settingName)===-1&&this.settingsWithChangedRules.push(a.settingName),this.navState==="rules"?this.listRules(a):this.listSettings(),this.settingsService.isRulesChanged=!0,this.changeDetector.detectChanges()}});i.apply(s=>{s.dialog=i,s.parameter=t}).open()}addUser(){this.openAddRuleConnection(!0)}addRole(){this.openAddRuleConnection(!1)}openAddRuleConnection(e){let t={rule:this.selectedRule,userName:this.getTool().userName,isUser:e},i=this.dialogService.modal(ii,this.settingsView).title(e?"Add User":"Add Role").id("lm-a-set-userrole-dialog").suppressEnterKey(!0).afterClose(s=>{if(s&&s.value){let a=this.itemByProp(this.items,"settingName",this.selectedSetting.settingName),o=a.rules,n=this.indexByProp(o,"sortOrder",s.value.rule.sortOrder);o[n]=s.value.rule,this.settingsWithChangedRules.indexOf(a.settingName)===-1&&this.settingsWithChangedRules.push(a.settingName),this.settingsService.isRulesChanged=!0,this.listConnections(o[n])}});i.apply(s=>{s.dialog=i,s.parameter=t}).open()}setBusy(e){this.isBusy=e}onFiltered(e){this.updateFilterState()}getItemCountText(){return E.getItemCountText("setting",this.filteredCount)}clearFilters(){if(this.isAreaAll()){let e=this.getActiveGrid();e&&(e.clearFilter(),this.updateFilterState());return}this.selectArea(this.settingAreas[0])}isAreaAll(){let e=this.selectedArea;return e&&e.name==="All"}onRowReordered(e){let t=e.startIndex,i=e.endIndex,s=this.itemByProp(this.items,"settingName",this.selectedSetting.settingName).rules,a=(n,r)=>{n.isChanged=!0,n.sortOrder=r},o=()=>{s.sort((n,r)=>n.sortOrder-r.sortOrder)};if(t!==i){let n;if(o(),a(s[t],i+1),t<i)for(n=t+1,n;n<=i;n++)a(s[n],s[n].sortOrder-1);else if(t>i)for(n=t-1,n;n>=i;n--)a(s[n],s[n].sortOrder+1);o(),this.settingsWithChangedRules.indexOf(this.selectedSetting.settingName)===-1&&this.settingsWithChangedRules.push(this.selectedSetting.settingName),this.settingsService.isRulesChanged=!0,this.listRules()}}updateGridSelection(e){if(this.isBusy)return;e.length!==this.selectionCount&&(this.selectionCount=e.length,this.selection=e,this.selected=e&&e.length===1?e[0].data:null)}performDiscard(){this.adminContext.nextTool(!1),this.settingsWithChangedRules=[]}getActiveGrid(){let e=this.navState;return e==="settings"?this.settingsDatagrid:e==="rules"?this.rulesDatagrid:e==="connections"?this.connectionsDatagrid:null}getTool(){return this.adminContext.get()}listItems(){let e=this.selectedSetting,t=this.selectedRule,i=this.items;this.isFeatureMode?this.listFeatures():!this.navState||this.navState==="settings"?this.listSettings():this.navState==="rules"?(e=this.itemByProp(i,"settingName",e.settingName),this.listRules(e)):this.navState==="connections"&&(e=this.itemByProp(i,"settingName",e.settingName),t=this.itemByProp(e.rules,"sortOrder",t.sortOrder),t?(this.selectedSetting=e,this.listConnections(t)):this.listRules(e))}updateFilterState(){let e=this;setTimeout(()=>{e.filteredCount=e.getActiveGrid().jQueryElement.find(".datagrid-row").length,e.isFiltered=e.visibleCount!==e.filteredCount},0)}initGridOptions(){let e=(s,a,o,n,r,l)=>r.setting.isTenant?S.text(s,a,o,n):Formatters.Hyperlink(s,a,oe.escapeStringForHtml(o),n,r,l),t=(s,a,o,n,r,l)=>r.noOfRules>0?Formatters.Hyperlink(s,a,o,n,r,l):Formatters.Integer(s,a,o,n,r,l),i="<div class='datagrid-cell-layout'><span class='datagrid-textarea lm-white-space-normal'><p>{{description1}}</p><p>{{description2}}</p><p>{{description3}}</p></span></div>";this.settingsGridOptions={rowTemplate:i,selectable:!1,filterable:!0,columns:[{width:70,id:"expander",resizable:!1,sortable:!1,formatter:Formatters.Expander,align:"center"},{width:300,id:"adm-s-col-sname",field:"setting.label",name:"Setting name",resizable:!0,sortable:!0,filterType:"text",formatter:e,click:(s,a)=>this.listRules(a[0].item)},{width:300,id:"adm-s-col-value",field:"displayValue",name:"Value",resizable:!0,sortable:!0,filterType:"text",formatter:Formatters.Hyperlink,click:(s,a)=>this.setSettingValue(a[0].item)},{width:200,id:"adm-s-col-cdate",field:"setting",name:"Change date",resizable:!0,sortable:!0,filterType:"text",formatter:(s,a,o,n,r,l)=>{if(r.changeDate==="*")return r.changeDate;let c=o.changeDate;return c?W.getLocaleDateString(c):""},sortFunction:s=>s.changeDate||""},{width:200,id:"adm-s-col-cbname",field:"setting",name:"Changed by",resizable:!0,sortable:!0,filterType:"text",formatter:(s,a,o,n,r,l)=>this.formatDisplayName(o),sortFunction:s=>this.formatDisplayName(s)},{width:90,id:"adm-s-col-norules",field:"noOfRules",name:"Rules",resizable:!0,sortable:!0,filterType:"integer",formatter:t,click:(s,a)=>this.listRules(a[0].item)},{width:93,id:"adm-s-col-actions",field:"actions",name:"Actions",resizable:!1,sortable:!1,formatter:Formatters.Actions,menuId:"settingsgrid-actions-menu",click:(s,a)=>{this.selectedSetting=a[0].item}}],dataset:[],emptyMessage:{title:"No settings found",icon:I.adminEmptyDatagridIcon}},this.featuresGridOptions={rowTemplate:i,selectable:!1,filterable:!0,columns:[{width:70,id:"expander",resizable:!1,sortable:!1,formatter:Formatters.Expander,align:"center"},{width:300,id:"adm-f-col-fname",field:"setting.label",name:"Feature name",resizable:!0,sortable:!0,filterType:"text",formatter:S.text},{width:300,id:"adm-f-col-value",field:"displayValue",name:"Value",resizable:!0,sortable:!0,filterType:"text",formatter:Formatters.Hyperlink,click:(s,a)=>this.setSettingValue(a[0].item)},{width:288,id:"adm-f-col-cdate",field:"setting",name:"Change date",resizable:!0,sortable:!0,filterType:"text",formatter:(s,a,o,n,r,l)=>{if(r.changeDate==="*")return r.changeDate;let c=o.changeDate;return c?W.getLocaleDateString(c):""},sortFunction:s=>s.changeDate||""},{width:295,id:"adm-f-col-cbname",field:"setting",name:"Changed by",resizable:!0,sortable:!0,filterType:"text",formatter:(s,a,o,n,r,l)=>this.formatDisplayName(o),sortFunction:s=>this.formatDisplayName(s)}],dataset:[],emptyMessage:{title:"No features found",icon:I.adminEmptyDatagridIcon}},this.rulesGridOptions={selectable:"multiple",filterable:!1,disableRowDeactivation:!0,clickToSelect:!1,columns:[{width:62,id:"rowReorder",field:"id",align:"center",sortable:!1,formatter:Formatters.RowReorder},{width:50,id:"selectionCheckbox",field:"",name:"",resizable:!1,sortable:!1,formatter:Formatters.SelectionCheckbox,align:"center"},{width:80,id:"adm-sr-col-sorder",field:"sortOrder",name:"Priority",resizable:!1,sortable:!1,formatter:Formatters.Integer},{width:329,id:"adm-sr-col-rname",field:"name",name:"Rule name",resizable:!0,sortable:!1,formatter:Formatters.Hyperlink,click:(s,a)=>this.listConnections(a[0].item)},{width:200,id:"adm-sr-col-value",field:"displayValue",name:"Value",resizable:!0,sortable:!1,formatter:Formatters.Hyperlink,click:(s,a)=>this.editRuleFromHyperlink(a[0].item)},{width:155,id:"adm-sr-col-ausers",field:"affectedUsers",name:"Affected users/groups",resizable:!0,sortable:!1,formatter:Formatters.Hyperlink,click:(s,a)=>this.listConnections(a[0].item)},{width:160,id:"adm-sr-col-cdate",field:"displayChangeDate",name:"Change date",resizable:!0,sortable:!1},{width:209,id:"adm-sr-col-cbname",field:"changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName}],dataset:[],emptyMessage:{title:"No rules found",icon:I.adminEmptyDatagridIcon}},this.connectionsGridOptions={selectable:"multiple",filterable:!0,disableRowDeactivation:!0,clickToSelect:!1,columns:[{width:50,id:"selectionCheckbox",field:"",name:"",resizable:!1,sortable:!1,formatter:Formatters.SelectionCheckbox,align:"center"},{width:695,id:"adm-sc-uname",field:"displayName",name:"User/role name",resizable:!0,sortable:!0,filterType:"text",formatter:S.displayName},{width:200,id:"adm-sc-col-cdate",field:"changeDate",name:"Change date",resizable:!0,sortable:!0,filterType:"text",formatter:(s,a,o,n,r,l)=>r.displayChangeDate||"",sortFunction:s=>s||""},{width:300,id:"adm-sc-col-cbname",field:"changedByName",name:"Changed by",resizable:!0,sortable:!0,filterType:"text",formatter:S.displayName}],dataset:[],emptyMessage:{title:"No connections found",icon:I.adminEmptyDatagridIcon}}}formatDisplayName(e){return e.changedBy?S.displayName(null,null,e.changedByName,null):""}itemByProp(e,t,i){return u.itemByProperty(e,t,i)}listConnections(e){if(!e.sortOrder)return;this.navState="connections",this.selectedRule=e,e.affectedUsers=e.ruleConnections.length;let t=v.copy(e.ruleConnections);this.connectionsGridOptions.dataset=t,this.connectionsDatagrid&&this.connectionsDatagrid.unSelectAllRows(),this.selectionCount=0}performReload(){this.setBusy(!0);let e=this.adminService;this.adminContext.initialize().subscribe(t=>{this.settingsWithChangedRules=[],this.listItems(),this.setBusy(!1)},t=>{this.setBusy(!1),e.handleError(t)})}editRuleFromHyperlink(e){e.sortOrder&&(this.selectedRule=e,this.openAddOrEditRule(e))}indexByProp(e,t,i){return u.indexByProperty(e,t,i)}getSelectedItems(){let e=[],t=this.selection;if(t)for(let i of t)e.push(i.data);return e}},$i.ctorParameters=()=>[{type:O},{type:y},{type:w},{type:b},{type:Ii},{type:be},{type:ki},{type:Ti}],$i.propDecorators={isFeatureMode:[{type:h}],settingsView:[{type:f,args:["adminSettingsView",{read:A,static:!1}]}],settingsDatagrid:[{type:f,args:["settingsDatagrid",{static:!1}]}],featuresDatagrid:[{type:f,args:["featuresDatagrid",{static:!1}]}],rulesDatagrid:[{type:f,args:["rulesDatagrid",{static:!1}]}],connectionsDatagrid:[{type:f,args:["connectionsDatagrid",{static:!1}]}]},$i);ai=d([p({selector:"lm-admin-settings",template:Kr,styles:[el]})],ai);var ka,oi=(ka=class extends R{constructor(){super("SettingDiscardComponent")}onOk(){this.dialog.close({button:C.Ok})}},ka.ctorParameters=()=>[],ka);oi=d([p({template:` <div class="row">
			<div class="twelve column">
				<p>Discard all changes?</p>
			</div>
		</div>

		<div class="modal-buttonset">
			<button
				class="btn-modal"
				id="lm-a-set-discard-dialog-cancel"
				(click)="dialog?.close()">
				Cancel
			</button>
			<button
				class="btn-modal-primary"
				id="lm-a-set-discard-dialog-ok"
				(click)="onOk()">
				OK
			</button>
		</div>`})],oi);var Hi,Oa=(Hi=class extends R{constructor(e,t,i,s,a,o,n){super("AdminContainerComponent",e),this.adminContext=t,this.adminService=i,this.containerService=s,this.routingService=a,this.dynamicPageAdminService=o,this.settingsService=n,this.tenant$=this.adminContext.tool$.pipe(N(r=>r.tenantId)),this.showPage$=this.routingService.currentPage$,this.openedPages$=this.routingService.openedPages$,this.canNavigateTo$=this.routingService.canNavigateTo$,this.isDynamicEditorOpen$=this.dynamicPageAdminService.editorToggled,this.constants=M,this.featureType={page:Di.Page,widget:Di.Widget,banner:Di.HeroWidget},this.AdminPages=T,this.cacheUnsubscriber=i.onCachesInvalidated().on(()=>{let r=i.getLastVisitedTab();this.reinitialize(r)})}ngOnInit(){W.detectBrowser();let e=this.adminService;this.applicationMenuTriggers=["#lm-admin-appmenu-trigger"],this.setBusy(!0),this.adminContext.initialize(!0).subscribe(()=>{this.setBusy(!1)},t=>{this.setBusy(!1),e.handleError(t)})}ngOnDestroy(){this.cacheUnsubscriber(),$("#lm-admin-appmenu-trigger").off("click")}close(){this.handleChangedSettings().subscribe(()=>{this.containerService.closeAdmin()})}hide(){this.containerService.hideAdmin(this.adminService.getLastVisitedTab())}onMenuToggled(e){if(e)try{let t=$("#application-menu").css("transition-duration"),i=parseFloat(t.split(",")[0].slice(0,-1))*1e3;this.adminService.raiseAppMenuExpanded(i)}catch{this.logDebug(this.logPrefix+" App Menu implementation has changed. Setting default timeout."),this.adminService.raiseAppMenuExpanded(300)}else this.adminService.raiseAppMenuCollapsed()}changeTab(e,t){this.handleChangedSettings(e).subscribe(()=>{this.routingService.navigateTo(e)})}onNavigationEvent(e){if(e.adminPage===T.DynamicPages){let i=this.dynamicPageAdminService.getPageClone();if(i!==null){let s="Confirm navigation",a=`Are you sure that you want to navigate to the Dynamic pages list? This will close the editor for page "${i.t}".`;this.showConfirm(s,a).subscribe(()=>{this.dynamicPageAdminService.closeEditor(),this.navigateToAdminPage(e)});return}}this.navigateToAdminPage(e)}reinitialize(e){this.setBusy(!0),this.adminContext.initialize().subscribe(()=>{this.routingService.navigateTo(e),this.setBusy(!1)},t=>{this.setBusy(!1),this.adminService.handleError(t)})}setBusy(e){this.isBusy=e}navigateToAdminPage(e){let t=e.adminPage;if(this.routingService.navigateTo(t),this.expressionFilter=null,e.entityId){let i=this.createExpressionFilter(e);this.expressionFilter=i}}createExpressionFilter(e){let t=He.All;return e.adminPage===T.DynamicPages?t=He.DynamicPages:e.adminPage===T.Announcements&&(t=He.Announcements),{expressionId:e.entityId,title:e.entityTitle,filterTarget:t}}handleChangedSettings(e){let t=new Ce;if(this.hasChangedSettings(e)){let s=this.adminService.getLastVisitedTab()===T.Features?"features":"settings",a=this.getChangedSettingComponent(),o=!0;this.showConfirm("Unsaved Changes",`There are unsaved changes. Do you want to save the changes before leaving ${s}? If you click no, all changes will be discarded.`).subscribe(()=>{a.save().subscribe(()=>this.asyncComplete(t,e),()=>t.complete()),o=!1},null,()=>{o&&(a.performDiscard(),this.asyncComplete(t,e))})}else this.asyncComplete(t,e);return t.asObservable()}hasChangedSettings(e){let t=this.adminService.getLastVisitedTab(),s=(this.settingsService.isSettingsChanged||this.settingsService.isRulesChanged)&&e!==T.Settings&&t===T.Settings,a=this.settingsService.isSettingsChanged&&e!==T.Features&&t===T.Features;return s||a}getChangedSettingComponent(){let e=this.adminService.getLastVisitedTab()===T.Features;return this.settingsComponents.find(t=>t.isFeatureMode===e)}},Hi.ctorParameters=()=>[{type:b},{type:O},{type:y},{type:Fe},{type:Gi},{type:F},{type:be}],Hi.propDecorators={settingsComponents:[{type:wi,args:[ai]}]},Hi);Oa=d([p({selector:"lm-admin-container",template:Fr,styles:[zr]})],Oa);var ll=`\uFEFF<div #lmaBulkDeleteView>\r
	<div class="row">\r
		<div class="twelve columns">\r
			<div\r
				soho-busyindicator\r
				[transparentOverlay]="false"\r
				[blockUI]="true"\r
				[activated]="isBusy"\r
				class="lm-admin-base-font-size">\r
				<lm-admin-message-banner\r
					[options]="warningMessageOptions"></lm-admin-message-banner>\r
				<div class="field">\r
					<div class="lm-margin-lg-t lm-margin-lg-b">\r
						<input\r
							soho-checkbox\r
							id="lm-a-bd-cb"\r
							type="checkbox"\r
							[(ngModel)]="isAllSelected"\r
							(ngModelChange)="onSelectDeselectAll($event)" />\r
						<label soho-label for="lm-a-bd-cb" [forCheckBox]="true"\r
							>Select / deselect all</label\r
						>\r
					</div>\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							name="lm-a-bd-as"\r
							class="switch"\r
							id="lm-a-bd-as"\r
							(ngModelChange)="\r
								includeOptions['includeSettingsRules'] =\r
									$event || includeOptions['includeSettingsRules']\r
							"\r
							[(ngModel)]="includeOptions['includeSettings']" />\r
						<label for="lm-a-bd-as" class="radio-label">Settings</label>\r
						<br />\r
					</div>\r
\r
					<div class="switch lm-margin-xl-l">\r
						<input\r
							type="checkbox"\r
							[disabled]="includeOptions['includeSettings']"\r
							name="lm-a-bd-asr"\r
							class="switch"\r
							id="lm-a-bd-asr"\r
							[(ngModel)]="includeOptions['includeSettingsRules']" />\r
						<label for="lm-a-bd-asr" class="radio-label">Settings rules</label>\r
						<br />\r
					</div>\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-us"\r
							name="lm-a-bd-us"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includeUserSettings']" />\r
						<label for="lm-a-bd-us" class="radio-label">User settings</label>\r
						<br />\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-prvp"\r
							name="lm-a-bd-prvp"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includePrivatePages']" />\r
						<label for="lm-a-bd-prvp" class="radio-label">Private pages</label>\r
						<br />\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-pp"\r
							name="lm-a-bd-pp"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includePublishedPages']" />\r
						<label for="lm-a-bd-pp" class="radio-label">Published pages</label>\r
						<br />\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-pw"\r
							name="lm-a-bd-pw"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includePublishedWidgets']" />\r
						<label for="lm-a-bd-pw" class="radio-label"\r
							>Published widgets</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-mm"\r
							name="lm-a-bd-mm"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includeMemos']" />\r
						<label for="lm-a-bd-mm" class="radio-label">Announcements</label>\r
						<br />\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							id="lm-a-bd-sp"\r
							name="lm-a-bd-sp"\r
							class="switch"\r
							[(ngModel)]="includeOptions['includeSecurityPolicies']" />\r
						<label for="lm-a-bd-sp" class="radio-label"\r
							>Security policies</label\r
						>\r
						<br />\r
					</div>\r
\r
					<ng-container *ngIf="showDynamic">\r
						<div class="switch">\r
							<input\r
								type="checkbox"\r
								id="lm-a-bd-dp"\r
								name="lm-a-bd-dp"\r
								class="switch"\r
								[(ngModel)]="includeOptions['includeDynamicPages']" />\r
							<label for="lm-a-bd-dp" class="radio-label">Dynamic pages</label>\r
							<br />\r
						</div>\r
\r
						<div class="switch">\r
							<input\r
								type="checkbox"\r
								id="lm-a-bd-dpa"\r
								name="lm-a-bd-dpa"\r
								class="switch"\r
								[(ngModel)]="includeOptions['includeDynamicPageArchives']" />\r
							<label for="lm-a-bd-dpa" class="radio-label"\r
								>Dynamic page archives</label\r
							>\r
							<br />\r
						</div>\r
					</ng-container>\r
				</div>\r
\r
				<button\r
					id="lm-a-bd-del"\r
					class="btn-primary lm-margin-md-t"\r
					[disabled]="isBusy"\r
					(click)="onClickDelete()">\r
					Delete\r
				</button>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var dl=`<div class="message-banner lm-item-bg lm-brd">\r
	<div class="banner-icon-area {{ options.backgroundClass }}">\r
		<svg\r
			soho-icon\r
			[icon]="options.icon"\r
			[extraIconClass]="options.iconClass"></svg>\r
	</div>\r
	<div class="banner-content">\r
		<span class="banner-title" *ngIf="options.title">{{ options.title }}</span>\r
		<span>{{ options.message }}</span>\r
		<div class="banner-content-actions">\r
			<button\r
				soho-button="tertiary"\r
				*ngFor="let action of options.actions"\r
				[icon]="action.icon || null"\r
				(click)="executeAction(action)">\r
				{{ action.text }}\r
			</button>\r
		</div>\r
	</div>\r
	<button\r
		soho-button="icon"\r
		id="lm-a-mb-dismiss"\r
		*ngIf="options.dismissable"\r
		icon="close"\r
		lm-click-stop-propagation\r
		(click)="onDismiss()"></button>\r
</div>\r
`;var cl=`.message-banner{width:100%;display:flex;border-radius:2px;border:1px solid}.message-banner>button{margin:5px;flex:0 0 auto}.message-banner>.banner-icon-area{flex:0 0 70px;display:flex;justify-content:center;align-items:center}.message-banner>.banner-icon-area svg{width:28px;height:28px}.message-banner>.banner-content{flex:1 1 auto;overflow:hidden}.message-banner>.banner-content>.banner-content-actions{margin:0 0 15px 20px}.message-banner>.banner-content span{font-size:14px;margin:30px 40px 20px 30px;flex:1 1 auto;display:flex}.banner-title{font-weight:700}
/*# sourceMappingURL=message-banner.css.map */
`;var ze;(function(m){m[m.Info=0]="Info",m[m.Warning=1]="Warning",m[m.Error=2]="Error",m[m.Success=3]="Success"})(ze||(ze={}));var qi,Ra=(qi=class extends R{constructor(){super("MessageBannerComponent"),this.options={message:""},this.dismissed=new V}ngOnInit(){W.isUndefined(this.options.level)||this.setTheme()}onDismiss(){this.dismissed.emit()}executeAction(e){e.execute()}setTheme(){let e,t,i;switch(this.options.level){case ze.Success:e="success",t="lm-success-bg",i="lm-success-fg";break;case ze.Error:e="error",t="lm-error-bg",i="lm-error-fg";break;case ze.Warning:e="alert",t="lm-warn-bg",i="lm-warn-fg";break;case ze.Info:default:e="info",t="lm-info-bg",i="lm-info-fg";break}this.options.icon=e,this.options.backgroundClass=t,this.options.iconClass=i}},qi.ctorParameters=()=>[],qi.propDecorators={options:[{type:h}],dismissed:[{type:U}]},qi);Ra=d([p({selector:"lm-admin-message-banner",template:dl,styles:[cl]})],Ra);var Qi,Ma=(Qi=class extends R{constructor(e,t,i,s,a){super("AdminBulkDeleteComponent",i),this.adminContext=e,this.adminService=t,this.sohoModalDialogService=s,this.featureService=a,this.onGoToExport=new V,this.isBusy=!1,this.isAllSelected=!1,this.showDynamic=!1,this.includeOptions={includeUserSettings:!1,includePrivatePages:!1,includePublishedPages:!1,includePublishedWidgets:!1,includeMemos:!1,includeSecurityPolicies:!1,includeDynamicPages:!1,includeDynamicPageArchives:!1,includeSettings:!1,includeSettingsRules:!1},this.warningMessageOptions={message:"Bulk delete will permanently remove all data in the selected categories. Before performing this action it is recommended to backup the content by exporting all data.",level:ze.Warning,actions:[{icon:"export",text:"Export",execute:()=>this.onGoToExport.emit(T.Export)}]},a.isFeatureEnabled(T.DynamicPages).subscribe(o=>{this.showDynamic=o,o||this.excludeDynamic()})}onSelectDeselectAll(e){let t=this.includeOptions,i=Object.keys(t);for(let s of i)t[s]=e;e&&!this.showDynamic&&this.excludeDynamic()}onClickDelete(){let e=this.createRequest();if(!e){this.showMessage("No category selected","Select at least one category to delete.");return}this.showConfirm("Confirm bulk delete","Are you sure that you want to delete all data in the selected categories?").subscribe(()=>{this.executeDelete(e)})}excludeDynamic(){this.includeOptions.includeDynamicPages=!1,this.includeOptions.includeDynamicPageArchives=!1}executeDelete(e){this.isBusy=!0,this.adminService.deleteBulk(e).subscribe(t=>{this.isBusy=!1;let i=this.createSuccessMessage(e,t);this.showMessage("Bulk delete complete",i)},()=>{this.isBusy=!1,this.showError("Unable to delete","An error occured when deleting.")})}createSuccessMessage(e,t){let i="",s=(a,o)=>{i.length>0&&(i+=", "),i+=o+" "+E.pluralize(a,o)};return e.includeUserSettings&&s("user setting",t.userSettingsCount),e.includePrivatePages&&s("private page",t.privatePagesCount),e.includePublishedPages&&s("published page",t.publishedPagesCount),e.includePublishedWidgets&&s("published widget",t.publishedWidgetsCount),e.includeMemos&&s("announcement",t.memosCount),e.includeSecurityPolicies&&s("security policy",t.securityPoliciesCount),e.includeDynamicPages&&s("dynamic page",t.dynamicPagesCount),e.includeDynamicPageArchives&&s("dynamic page archive",t.dynamicPageArchivesCount),e.includeSettingsRules&&s("settings rule",t.settingsRulesCount),e.includeSettings&&s("setting",t.settingsCount),"The following data was deleted from the selected categories: "+i}createRequest(){let e=this.includeOptions,t={},i=Object.keys(e),s=!1;for(let a of i)e[a]&&(t[a]=!0,s=!0);return s?t:null}},Qi.ctorParameters=()=>[{type:O},{type:y},{type:b},{type:w},{type:Wi}],Qi.propDecorators={content:[{type:f,args:["lmaBulkDeleteView",{read:A,static:!1}]}],onGoToExport:[{type:U}]},Qi);Ma=d([p({selector:"lm-admin-bulk-delete",template:ll})],Ma);var ml=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<!-- Show info if banner widgets arent enabled -->\r
	<div\r
		class="lm-admin-quota-message lm-margin-xl-b lm-pull-none"\r
		*ngIf="entityType === 3 && featureBannerOn === false">\r
		<svg soho-icon icon="alert" [alert]="true"></svg>\r
		<p class="lm-pull-left" id="lm-a-fbw-dmessage">\r
			Banner widgets are disabled. Enable the Banner Widget feature in the\r
			<a id="lm-a-fbw-dlink" href="" (click)="goToFeaturesPage($event)"\r
				>Features page</a\r
			>.\r
		</p>\r
	</div>\r
	<soho-toolbar-flex>\r
		<soho-toolbar-flex-section [isTitle]="true"></soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-button="icon"\r
				icon="refresh"\r
				(click)="refresh()"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				icon="delete"\r
				(click)="onClickRemoveAsFeatured()"\r
				*ngIf="!isReadOnly">\r
				Remove as Featured ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				(click)="editAccess()"\r
				[disabled]="!canEdit()"\r
				*ngIf="!isReadOnly">\r
				Edit Permissions\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div\r
		soho-datagrid\r
		id="gridFeatured"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"\r
		(rowReordered)="onRowReordered($event)"></div>\r
</div>\r
`;var Ji,La=(Ji=class extends q{constructor(e,t,i,s,a,o,n,r){super("FeaturedPagesComponent","featured",e,t,i,s,a),this.adminContext=o,this.viewRef=n,this.settingsService=r,this.onGoToFeatures=new V,this.subscriptions=new nt,this.subscriptions.add(this.settingsService.features$.subscribe(l=>{let c=u.itemByProperty(l,"settingName","BannerWidget");c&&(this.featureBannerOn=c.value==="true")}))}ngOnInit(){this.listItems();let e=this.adminContext.get();e&&(this.isAdministrator=e.isAdministrator,this.featureBannerOn=e.featureBanner,this.isReadOnly=E.isReadOnlyUser(e)),this.initGrid()}ngOnDestroy(){this.subscriptions.unsubscribe()}listItems(){let e=this.request(),t=this.adminService.listFeatured(e);this.execute(t)}canEdit(){return this.selectionCount!==1||this.selected.isDynamic?!1:this.isAdministrator?!0:!this.selected.isStandard}onClickRemoveAsFeatured(){let e=this.getSelectedItems(),t=e.length;for(let i of e){let s={listType:Ar.Featured,entityType:this.entityType,entity:i.id};this.adminService.removeFeaturedItem(s).subscribe(()=>{},a=>{this.adminService.handleError(a)},()=>{t--,t||(this.setBusy(!1),this.refresh())})}}onExpandRow(e){let t=$(e.detail).find(".datagrid-row-detail-padding").empty();if(e.item){let i=e.item,s=`<div class="datagrid-cell-layout">
					<p><span class="datagrid-textarea lm-white-space-normal">${this.escape(i.description)}</span></p>
					<p>
						<span class="label">Change date: ${W.getLocaleDateString(i.changeDate)}</span>
						<span class="label">Changed by: ${this.escape(i.changedByName)}</span>
					`;i.isStandard||(s+=`<span class="label">Owner: ${this.escape(i.ownerName)}</span></p>`),s+="</div>",$(t).append($(s))}}editAccess(){let e=this.getSelectedItems()[0];this.entityType===Di.Page?this.openPageAccess(e):this.openWidgetAccess(e)}goToFeaturesPage(e){e.preventDefault(),this.onGoToFeatures.emit(T.Features)}onRowReordered(e){let t=e.startIndex,i=e.endIndex;if(t===i)return;let s=this.request(this.items),a=this.adminService.reorderFeatured(s);this.execute(a)}getDataGrid(){return this.featuredDatagrid}getColumns(){return[{width:62,id:"rowReorder",field:"id",align:"center",sortable:!1,formatter:Formatters.RowReorder},this.getSelectionColumn(),{width:383,id:"adm-fp-col-t",field:"title",name:"Title",resizable:!0,sortable:!1,formatter:Formatters.Expander},{width:150,id:"adm-fp-col-typ",field:"isStandard",name:"Type",resizable:!0,sortable:!1,formatter:S.pageOrWidgetType},{width:200,id:"adm-fp-col-sd",field:"setDate",name:"Set date",resizable:!0,sortable:!1,formatter:S.date},{width:200,id:"adm-fp-col-sbn",field:"setByName",name:"Set by",resizable:!0,sortable:!1,formatter:S.displayName},{width:200,id:"adm-fp-col-hr",field:"hasRestrictions",name:"Permissions",sortable:!1,formatter:S.restricted}]}execute(e){this.setBusy(!0),e.subscribe(t=>{if(!t.hasError()){let i=t.content;this.items=i,this.updateGridData()}this.setBusy(!1)},t=>{this.setBusy(!1),this.adminService.handleError(t)})}request(e){let t={entityType:this.entityType};return e&&(t.items=e.map(i=>({id:i.id,title:i.title}))),t}openPageAccess(e){let t={data:{id:e.id,title:e.title}},i=e.isStandard?xt.standardPages(this.languageService,t):xt.publishedPages(this.languageService,t);i.callback=()=>this.listItems(),this.adminService.openPageAccessDialog(i,this.viewRef)}openWidgetAccess(e){let t={widgetId:e.id,title:e.title};this.adminService.openWidgetAccessDialog(t,()=>{this.listItems()},this.viewRef)}initGrid(){let e;this.entityType===1?e="widgets":this.entityType===2?e="pages":e="banner widgets",this.datagridOptions={selectable:"multiple",disableRowDeactivation:!0,expandableRow:!0,clickToSelect:!1,rowReorder:!this.isReadOnly,columns:this.getColumns(),dataset:[],emptyMessage:{title:`No featured ${e} found`,icon:I.adminEmptyDatagridIcon}}}},Ji.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:A},{type:be}],Ji.propDecorators={featuredDatagrid:[{type:f,args:[Ai,{static:!1}]}],entityType:[{type:h}],onGoToFeatures:[{type:U}]},Ji);La=d([p({selector:"lm-admin-featured",template:ml})],La);var pl=`\uFEFF<div\r
	class="lm-admin-base-font-size"\r
	*ngIf="canNavigateTo$ | async as canNavigateTo">\r
	<div class="lm-admin-home-header">\r
		<div class="lm-admin-home-header-title">\r
			<h1 id="lm-a-hom-h">Homepages Administration</h1>\r
			<div id="lm-a-hom-h2">Tenant: {{ tenant$ | async }}</div>\r
		</div>\r
\r
		<div class="lm-admin-home-card-container">\r
			<div\r
				class="lm-admin-home-card dark"\r
				*ngIf="canNavigateTo[AdminPages.Settings]">\r
				<div>\r
					<svg soho-icon icon="settings"></svg>\r
					<h2 id="lm-a-hom-set-h">Settings</h2>\r
				</div>\r
				<div class="lm-admin-home-card-description" id="lm-a-hom-set-d">\r
					Update settings for Homepages or enable and disable features.\r
				</div>\r
				<div class="lm-admin-home-card-links">\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.Settings]"\r
						soho-hyperlink\r
						id="lm-a-hom-set-set"\r
						(click)="navigateTo(AdminPages.Settings, $event)"\r
						>View {{ AdminPages[AdminPages.Settings] }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.Features]"\r
						soho-hyperlink\r
						id="lm-a-hom-set-ftr"\r
						(click)="navigateTo(AdminPages.Features, $event)"\r
						>View {{ AdminPages[AdminPages.Features] }}</a\r
					>\r
				</div>\r
			</div>\r
\r
			<div class="lm-admin-home-card dark">\r
				<div>\r
					<svg class="icon" aria-hidden="true" focusable="false">\r
						<use xlink:href="#lime-icon-announcement" />\r
					</svg>\r
					<h2 id="lm-a-hom-mem-h">Announcements</h2>\r
				</div>\r
				<div class="lm-admin-home-card-description" id="lm-a-hom-mem-d">\r
					Manage and schedule announcements.\r
				</div>\r
				<div class="lm-admin-home-card-links">\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.Announcements]"\r
						soho-hyperlink\r
						id="lm-a-hom-mem-vie"\r
						(click)="navigateTo(AdminPages.Announcements, $event)">\r
						{{ AdminPages[AdminPages.Announcements] }}</a\r
					>\r
				</div>\r
			</div>\r
\r
			<div class="lm-admin-home-card dark">\r
				<div>\r
					<svg soho-icon icon="document"></svg>\r
					<h2 id="lm-a-hom-p-h">Pages</h2>\r
				</div>\r
				<div class="lm-admin-home-card-description" id="lm-a-hom-p-d">\r
					Manage pages and related permissions.\r
				</div>\r
				<div class="lm-admin-home-card-links">\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.PrivatePages]"\r
						soho-hyperlink\r
						id="lm-a-hom-p-pri"\r
						(click)="navigateTo(AdminPages.PrivatePages, $event)"\r
						>{{ AdminPages[AdminPages.PrivatePages] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.PublishedPages]"\r
						soho-hyperlink\r
						id="lm-a-hom-p-pub"\r
						(click)="navigateTo(AdminPages.PublishedPages, $event)"\r
						>{{ AdminPages[AdminPages.PublishedPages] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.StandardPages]"\r
						soho-hyperlink\r
						id="lm-a-hom-p-std"\r
						(click)="navigateTo(AdminPages.StandardPages, $event)"\r
						>{{ AdminPages[AdminPages.StandardPages] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.DynamicPages]"\r
						soho-hyperlink\r
						id="lm-a-hom-p-dyn"\r
						(click)="navigateTo(AdminPages.DynamicPages, $event)"\r
						>{{ AdminPages[AdminPages.DynamicPages] | lmCamelCaseSpace }}</a\r
					>\r
				</div>\r
			</div>\r
\r
			<div class="lm-admin-home-card dark">\r
				<div>\r
					<svg class="icon" aria-hidden="true" focusable="false">\r
						<use xlink:href="#lime-icon-widget" />\r
					</svg>\r
					<h2 id="lm-a-hom-w-h">Widgets</h2>\r
				</div>\r
				<div class="lm-admin-home-card-description" id="lm-a-hom-w-d">\r
					Manage widgets and related permissions.\r
				</div>\r
				<div class="lm-admin-home-card-links">\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.PublishedWidgets]"\r
						soho-hyperlink\r
						id="lm-a-hom-w-pub"\r
						(click)="navigateTo(AdminPages.PublishedWidgets, $event)"\r
						>{{ AdminPages[AdminPages.PublishedWidgets] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.StandardWidgets]"\r
						soho-hyperlink\r
						id="lm-a-hom-w-std"\r
						(click)="navigateTo(AdminPages.StandardWidgets, $event)"\r
						>{{ AdminPages[AdminPages.StandardWidgets] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.TenantWidgets]"\r
						soho-hyperlink\r
						id="lm-a-hom-w-ten"\r
						(click)="navigateTo(AdminPages.TenantWidgets, $event)"\r
						>{{ AdminPages[AdminPages.TenantWidgets] | lmCamelCaseSpace }}</a\r
					>\r
					<a\r
						*ngIf="canNavigateTo[AdminPages.EarlyAccessWidgets]"\r
						soho-hyperlink\r
						id="lm-a-hom-w-ea"\r
						(click)="navigateTo(AdminPages.EarlyAccessWidgets, $event)"\r
						>{{\r
							AdminPages[AdminPages.EarlyAccessWidgets] | lmCamelCaseSpace\r
						}}</a\r
					>\r
				</div>\r
			</div>\r
		</div>\r
	</div>\r
\r
	<div class="lm-admin-home-card-container lm-bg">\r
		<div class="lm-admin-home-card lm-item light">\r
			<div>\r
				<svg soho-icon icon="locked" class="lm-icon-accent"></svg>\r
				<h3 id="lm-a-hom-sp-h">Security Policies</h3>\r
			</div>\r
			<div class="lm-admin-home-card-description" id="lm-a-hom-sp-d">\r
				{{\r
					getCardText(\r
						AdminPages.SecurityPolicies,\r
						"Add, remove and update\r
				security policies.",\r
						"View and test security policies."\r
					) | async\r
				}}\r
			</div>\r
			<div class="lm-admin-home-card-links">\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.SecurityPolicies]"\r
					soho-hyperlink\r
					id="lm-a-hom-sp-sp"\r
					(click)="navigateTo(AdminPages.SecurityPolicies, $event)"\r
					>{{ AdminPages[AdminPages.SecurityPolicies] | lmCamelCaseSpace }}</a\r
				>\r
			</div>\r
		</div>\r
\r
		<div class="lm-admin-home-card lm-item light">\r
			<div>\r
				<svg soho-icon icon="star-outlined" class="lm-icon-accent"></svg>\r
				<h3 id="lm-a-hom-ftr-h">Featured</h3>\r
			</div>\r
			<div class="lm-admin-home-card-description" id="lm-a-hom-ftr-d">\r
				View and remove featured pages and widgets.\r
			</div>\r
			<div class="lm-admin-home-card-links">\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.FeaturedPages]"\r
					soho-hyperlink\r
					id="lm-a-hom-ftr-p"\r
					(click)="navigateTo(AdminPages.FeaturedPages, $event)"\r
					>{{ AdminPages[AdminPages.FeaturedPages] | lmCamelCaseSpace }}</a\r
				>\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.FeaturedWidgets]"\r
					soho-hyperlink\r
					id="lm-a-hom-ftr-w"\r
					(click)="navigateTo(AdminPages.FeaturedWidgets, $event)"\r
					>{{ AdminPages[AdminPages.FeaturedWidgets] | lmCamelCaseSpace }}</a\r
				>\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.FeaturedBannerWidgets]"\r
					soho-hyperlink\r
					id="lm-a-hom-ftr-wb"\r
					(click)="navigateTo(AdminPages.FeaturedBannerWidgets, $event)"\r
					>{{\r
						AdminPages[AdminPages.FeaturedBannerWidgets] | lmCamelCaseSpace\r
					}}</a\r
				>\r
			</div>\r
		</div>\r
\r
		<div class="lm-admin-home-card lm-item light">\r
			<div>\r
				<svg class="icon lm-icon-accent" aria-hidden="true" focusable="false">\r
					<use xlink:href="#lime-icon-tags" />\r
				</svg>\r
				<h3 id="lm-a-hom-tag-h">Tags</h3>\r
			</div>\r
			<div class="lm-admin-home-card-dcription" id="lm-a-hom-tag-d">\r
				Add and remove tag suggestions for pages and widgets.\r
			</div>\r
			<div class="lm-admin-home-card-links">\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.Tags]"\r
					soho-hyperlink\r
					id="lm-a-hom-tag-t"\r
					(click)="navigateTo(AdminPages.Tags, $event)"\r
					>Go to {{ AdminPages[AdminPages.Tags] }}</a\r
				>\r
			</div>\r
		</div>\r
\r
		<div\r
			class="lm-admin-home-card lm-item light"\r
			*ngIf="canNavigateTo[AdminPages.Import]">\r
			<div>\r
				<svg soho-icon icon="import" class="lm-icon-accent"></svg>\r
				<h3 id="lm-a-hom-ex-h">Import & Export</h3>\r
			</div>\r
			<div class="lm-admin-home-card-description" id="lm-a-hom-ex-d">\r
				Import or export all or part of the Homepages data, including settings,\r
				properties, content and permissions.\r
			</div>\r
			<div class="lm-admin-home-card-links">\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.Import]"\r
					soho-hyperlink\r
					id="lm-a-hom-im-im"\r
					(click)="navigateTo(AdminPages.Import, $event)"\r
					>Go to {{ AdminPages[AdminPages.Import] }}</a\r
				>\r
				<a\r
					*ngIf="canNavigateTo[AdminPages.Export]"\r
					soho-hyperlink\r
					id="lm-a-hom-ex-ex"\r
					(click)="navigateTo(AdminPages.Export, $event)"\r
					>Go to {{ AdminPages[AdminPages.Export] }}</a\r
				>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var hl=`.lm-admin-home-header{background-color:#212224;padding:60px 40px}.lm-admin-home-header h2,.lm-admin-home-header div{color:#e6e6e6}.lm-admin-home-header-title{margin-left:50px;font-size:14px}.lm-admin-home-header-title h1{font-size:30px;margin-bottom:10px}.lm-admin-home-header-title h1,.lm-admin-home-header-title div{color:#fff}.lm-admin-home-card-container{display:flex;margin:40px 40px 0;justify-content:center}.lm-admin-home-card-container h2,.lm-admin-home-card-container h3{display:inline-flex;line-height:normal;font-weight:700;margin-left:10px;vertical-align:middle}.lm-admin-home-card-container h2{font-size:22px;margin-bottom:20px}.lm-admin-home-card-container h3{font-size:18px;margin-bottom:15px}.lm-admin-home-card-container a,.lm-admin-home-card-container div{font-size:14px}.lm-admin-home-card-container a{text-decoration:none}.lm-admin-home-card{display:flex;flex-direction:column;position:relative;margin:10px;padding:30px;border-style:solid!important;border-width:1px!important;border-radius:3px}.lm-admin-home-card.dark{background-color:#1f1e1f;width:33.333%;border:#414247;padding:30px}.lm-admin-home-card.dark .icon{height:30px;width:30px;color:#e6e6e6}.lm-admin-home-card.dark .hyperlink{color:#69b5dd}.lm-admin-home-card.dark .hyperlink:hover{color:#368ac0}.lm-admin-home-card.light{width:25%}.lm-admin-home-card.light .icon{height:25px;width:25px;color:#383838}.lm-admin-home-card-description{line-height:2rem;margin-bottom:110px}.lm-admin-home-card-links{position:absolute;bottom:35px;line-height:1.5em}.lm-admin-home-card-links a{display:block}@media screen and (max-width: 1000px){.lm-admin-home-card-container{display:block}.lm-admin-home-card.dark,.lm-admin-home-card.light{width:100%}}
/*# sourceMappingURL=home.css.map */
`;var Xi,Na=(Xi=class extends R{constructor(e,t,i){super("AdminHomeComponent"),this.contextService=e,this.accessService=t,this.routingService=i,this.changeTab=new V,this.canNavigateTo$=this.routingService.canNavigateTo$,this.AdminPages=T,this.tenant$=this.contextService.tool$.pipe(N(s=>s.tenantId))}navigateTo(e){this.routingService.navigateTo(e)}getCardText(e,t,i){return this.accessService.editable(e).pipe(N(s=>s?t:i))}},Xi.ctorParameters=()=>[{type:O},{type:zi},{type:Gi}],Xi.propDecorators={changeTab:[{type:U}]},Xi);Na=d([p({selector:"lm-admin-home",template:pl,styles:[hl]})],Na);var ul=`\uFEFF<div #lmAdminExport>\r
	<div class="row">\r
		<div class="twelve columns">\r
			<div\r
				soho-busyindicator\r
				[transparentOverlay]="false"\r
				[blockUI]="true"\r
				[activated]="isBusy"\r
				class="lm-admin-base-font-size">\r
				<p class="lm-margin-sm-b">Export the following Homepages data:</p>\r
\r
				<div class="field">\r
					<div class="lm-margin-lg-t lm-margin-lg-b">\r
						<input\r
							soho-checkbox\r
							id="lm-a-exp-cb"\r
							type="checkbox"\r
							[(ngModel)]="isAllSelected"\r
							(ngModelChange)="onSelectDeselectAll($event)" />\r
						<label soho-label for="lm-a-exp-cb" [forCheckBox]="true"\r
							>Select / deselect all</label\r
						>\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							name="enableExportSettings"\r
							class="switch"\r
							id="enableExportSettings"\r
							(ngModelChange)="handleChange($event, 'includesettings')"\r
							[(ngModel)]="includeOptions['includesettings']" />\r
						<label\r
							for="enableExportSettings"\r
							class="radio-label e2e-enableExportSettings"\r
							>Settings</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="switch lm-margin-xl-l">\r
						<input\r
							type="checkbox"\r
							[disabled]="!includeOptions['includesettings']"\r
							name="enableExportRuleSettings"\r
							class="switch"\r
							id="enableExportRuleSettings"\r
							[(ngModel)]="includeOptions['includesettingsrules']" />\r
						<label\r
							for="enableExportRuleSettings"\r
							class="radio-label e2e-enableExportRuleSettings"\r
							>Settings rules</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportUserSettings"\r
								class="switch"\r
								id="enableExportUserSettings"\r
								[(ngModel)]="includeOptions['includeusersettings']" />\r
							<label\r
								for="enableExportUserSettings"\r
								class="radio-label e2e-enableExportUserSettings"\r
								>User settings</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="userSettingsExportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['usersettingsfilter']"\r
								[readOnly]="!includeOptions['includeusersettings']" />\r
						</div>\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							name="enableExportProperties"\r
							class="switch"\r
							id="enableExportProperties"\r
							[(ngModel)]="includeOptions['includeproperties']" />\r
						<label\r
							for="enableExportProperties"\r
							class="radio-label e2e-enableExportProperties"\r
							>Properties</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportPublishedWidgets"\r
								class="switch"\r
								id="enableExportPublishedWidgets"\r
								(ngModelChange)="\r
									handleChange($event, 'includepublishedwidgets')\r
								"\r
								[(ngModel)]="includeOptions['includepublishedwidgets']" />\r
							<label\r
								for="enableExportPublishedWidgets"\r
								class="radio-label e2e-enableExportPublishedWidgets"\r
								>Published widgets</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="publishedWidgetsExportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['publishedwidgetsfilter']"\r
								[readOnly]="!includeOptions['includepublishedwidgets']" />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l lm-margin-zero-t">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedwidgets']"\r
								name="enableExportPublishedWidgetAccess"\r
								class="switch"\r
								id="enableExportPublishedWidgetAccess"\r
								[(ngModel)]="includeOptions['includepublishedwidgetaccess']" />\r
							<label\r
								for="enableExportPublishedWidgetAccess"\r
								class="radio-label e2e-enableExportPublishedWidgetAccess"\r
								>Published widget permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="switch lm-margin-md-t">\r
						<input\r
							type="checkbox"\r
							name="enableExportStandardWidgetAccess"\r
							class="switch"\r
							id="enableExportStandardWidgetAccess"\r
							[(ngModel)]="includeOptions['includestandardwidgetaccess']" />\r
						<label\r
							for="enableExportStandardWidgetAccess"\r
							class="radio-label e2e-enableExportStandardWidgetAccess"\r
							>Standard widget permissions</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportPublishedPages"\r
								class="switch"\r
								id="enableExportPublishedPages"\r
								(ngModelChange)="handleChange($event, 'includepublishedpages')"\r
								[(ngModel)]="includeOptions['includepublishedpages']" />\r
							<label\r
								for="enableExportPublishedPages"\r
								class="radio-label e2e-enableExportPublishedPages"\r
								>Published pages</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="publishedPagesExportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['publishedpagesfilter']"\r
								[readOnly]="!includeOptions['includepublishedpages']" />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l lm-margin-zero-t">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedpages']"\r
								name="enableExportPublishedPageConnections"\r
								class="switch"\r
								id="enableExportPublishedPageConnections"\r
								[(ngModel)]="\r
									includeOptions['includepublishedpageconnections']\r
								" />\r
							<label\r
								for="enableExportPublishedPageConnections"\r
								class="radio-label e2e-enableExportPublishedPageConnections"\r
								>Published page connections</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedpages']"\r
								name="enableExportPublishedPageAccess"\r
								class="switch"\r
								id="enableExportPublishedPageAccess"\r
								[(ngModel)]="includeOptions['includepublishedpageaccess']" />\r
							<label\r
								for="enableExportPublishedPageAccess"\r
								class="radio-label e2e-enableExportPublishedPageAccess"\r
								>Published page permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportPrivatePages"\r
								class="switch"\r
								id="enableExportPrivatePages"\r
								[(ngModel)]="includeOptions['includeprivatepages']" />\r
							<label\r
								for="enableExportPrivatePages"\r
								class="radio-label e2e-enableExportPrivatePages"\r
								>Private pages</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="privatePagesExportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['privatepagesfilter']"\r
								[readOnly]="!includeOptions['includeprivatepages']" />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field" *ngIf="isStandardPagesEnabled">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportStandardPagesAccess"\r
								class="switch"\r
								id="enableExportStandardPagesAccess"\r
								[(ngModel)]="includeOptions['includestandardpageaccess']" />\r
							<label for="enableExportStandardPagesAccess" class="radio-label"\r
								>Standard page permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportPolicies"\r
								class="switch"\r
								id="enableExportPolicies"\r
								[(ngModel)]="includeOptions['includepolicies']" />\r
							<label for="enableExportPolicies" class="radio-label"\r
								>Security policies</label\r
							>\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableExportMemos"\r
								class="switch"\r
								id="enableExportMemos"\r
								[(ngModel)]="includeOptions['includememos']" />\r
							<label for="enableExportMemos" class="radio-label"\r
								>Announcements</label\r
							>\r
						</div>\r
					</div>\r
				</div>\r
			</div>\r
\r
			<div class="row lm-margin-lg-b">{{ fileMessage }}</div>\r
\r
			<button\r
				class="btn-secondary"\r
				[disabled]="isBusy || !fileExists"\r
				(click)="download()">\r
				Download\r
			</button>\r
			<button\r
				class="btn-secondary"\r
				[disabled]="isBusy || !fileExists"\r
				(click)="confirmDelete()">\r
				Delete\r
			</button>\r
			<button\r
				class="btn-secondary lm-margin-md-t"\r
				[disabled]="!isBusy || isCancelled"\r
				(click)="cancel()">\r
				Cancel\r
			</button>\r
			<button\r
				class="btn-primary e2e-export-btn"\r
				[disabled]="isBusy"\r
				(click)="onClickExport()">\r
				Export\r
			</button>\r
\r
			<div class="row lm-margin-xl-t" *ngIf="statusMessageList.length > 0">\r
				<hr />\r
				<ul class="lm-margin-md-t lm-margin-md-l">\r
					<li\r
						*ngFor="let item of statusMessageList"\r
						class="lm-admin-base-font-size">\r
						{{ item.message }}\r
					</li>\r
				</ul>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var gl=`\uFEFF<div #lmAdminImport>\r
	<div class="row">\r
		<div class="twelve columns">\r
			<div\r
				soho-busyindicator\r
				[transparentOverlay]="false"\r
				[blockUI]="true"\r
				[activated]="isBusy"\r
				class="lm-admin-base-font-size">\r
				<p class="lm-margin-sm-b">Import the following Homepages data:</p>\r
\r
				<div class="field">\r
					<div class="lm-margin-lg-t lm-margin-lg-b">\r
						<input\r
							soho-checkbox\r
							id="lm-a-imp-cb"\r
							type="checkbox"\r
							[(ngModel)]="isAllSelected"\r
							(ngModelChange)="onSelectDeselectAll($event)" />\r
						<label soho-label for="lm-a-imp-cb" [forCheckBox]="true"\r
							>Select / deselect all</label\r
						>\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							name="enableImportSettings"\r
							class="switch"\r
							id="enableImportSettings"\r
							(ngModelChange)="handleChange($event, 'includesettings')"\r
							[(ngModel)]="includeOptions['includesettings']" />\r
						<label\r
							for="enableImportSettings"\r
							class="radio-label e2e-enableImportSettings"\r
							>Settings</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="switch lm-margin-xl-l">\r
						<input\r
							type="checkbox"\r
							[disabled]="!includeOptions['includesettings']"\r
							name="enableImportRuleSettings"\r
							class="switch"\r
							id="enableImportRuleSettings"\r
							[(ngModel)]="includeOptions['includesettingsrules']" />\r
						<label\r
							for="enableImportRuleSettings"\r
							class="radio-label e2e-enableImportRuleSettings"\r
							>Settings rules</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportUserSettings"\r
								class="switch"\r
								id="enableImportUserSettings"\r
								[(ngModel)]="includeOptions['includeusersettings']" />\r
							<label\r
								for="enableImportUserSettings"\r
								class="radio-label e2e-enableImportUserSettings"\r
								>User settings</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="userSettingsImportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['usersettingsfilter']"\r
								[readOnly]="!includeOptions['includeusersettings']" />\r
						</div>\r
					</div>\r
\r
					<div class="switch">\r
						<input\r
							type="checkbox"\r
							name="enableImportProperties"\r
							class="switch"\r
							id="enableImportProperties"\r
							[(ngModel)]="includeOptions['includeproperties']" />\r
						<label\r
							for="enableImportProperties"\r
							class="radio-label e2e-enableImportProperties"\r
							>Properties</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportPublishedWidgets"\r
								class="switch"\r
								id="enableImportPublishedWidgets"\r
								(ngModelChange)="\r
									handleChange($event, 'includepublishedwidgets')\r
								"\r
								[(ngModel)]="includeOptions['includepublishedwidgets']" />\r
							<label\r
								for="enableImportPublishedWidgets"\r
								class="radio-label e2e-enableImportPublishedWidgets"\r
								>Published widgets</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="publishedWidgetsImportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['publishedwidgetsfilter']"\r
								[readOnly]="!includeOptions['includepublishedwidgets']" />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l lm-margin-zero-t">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedwidgets']"\r
								name="enableImportPublishedWidgetAccess"\r
								class="switch"\r
								id="enableImportPublishedWidgetAccess"\r
								[(ngModel)]="includeOptions['includepublishedwidgetaccess']" />\r
							<label\r
								for="enableImportPublishedWidgetAccess"\r
								class="radio-label e2e-enableImportPublishedWidgetAccess"\r
								>Published widget permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="switch lm-margin-md-t">\r
						<input\r
							type="checkbox"\r
							name="enableImportStandardWidgetAccess"\r
							class="switch"\r
							id="enableImportStandardWidgetAccess"\r
							[(ngModel)]="includeOptions['includestandardwidgetaccess']" />\r
						<label\r
							for="enableImportStandardWidgetAccess"\r
							class="radio-label e2e-enableImportStandardWidgetAccess"\r
							>Standard widget permissions</label\r
						>\r
						<br />\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportPublishedPages"\r
								class="switch"\r
								id="enableImportPublishedPages"\r
								(ngModelChange)="handleChange($event, 'includepublishedpages')"\r
								[(ngModel)]="includeOptions['includepublishedpages']" />\r
							<label\r
								for="enableImportPublishedPages"\r
								class="radio-label e2e-enableImportPublishedPages"\r
								>Published pages</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="publishedPagesImportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['publishedpagesfilter']"\r
								[readOnly]="!includeOptions['includepublishedpages']" />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l lm-margin-zero-t">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedpages']"\r
								name="enableImportPublishedPageConnections"\r
								class="switch"\r
								id="enableImportPublishedPageConnections"\r
								[(ngModel)]="\r
									includeOptions['includepublishedpageconnections']\r
								" />\r
							<label\r
								for="enableImportPublishedPageConnections"\r
								class="radio-label e2e-enableImportPublishedPageConnections"\r
								>Published page connections</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="switch lm-margin-xl-l">\r
							<input\r
								type="checkbox"\r
								[disabled]="!includeOptions['includepublishedpages']"\r
								name="enableImportPublishedPageAccess"\r
								class="switch"\r
								id="enableImportPublishedPageAccess"\r
								[(ngModel)]="includeOptions['includepublishedpageaccess']" />\r
							<label\r
								for="enableImportPublishedPageAccess"\r
								class="radio-label e2e-enableImportPublishedPageAccess"\r
								>Published page permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportPrivatePages"\r
								class="switch"\r
								id="enableImportPrivatePages"\r
								[(ngModel)]="includeOptions['includeprivatepages']" />\r
							<label\r
								for="enableImportPrivatePages"\r
								class="radio-label e2e-enableImportPrivatePages"\r
								>Private pages</label\r
							>\r
							<br />\r
						</div>\r
\r
						<div class="field lm-margin-lg-l lm-margin-sm-t">\r
							<input\r
								id="privatePagesImportFilter"\r
								placeholder="Filter..."\r
								type="text"\r
								[(ngModel)]="includeOptions['privatepagesfilter']"\r
								[readOnly]="!includeOptions['includeprivatepages']" />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field" *ngIf="isStandardPagesEnabled">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportStandardPageAccess"\r
								class="switch"\r
								id="enableImportStandardPageAccess"\r
								[(ngModel)]="includeOptions['includestandardpageaccess']" />\r
							<label for="enableImportStandardPageAccess" class="radio-label"\r
								>Standard page permissions</label\r
							>\r
							<br />\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportPolicies"\r
								class="switch"\r
								id="enableImportPolicies"\r
								[(ngModel)]="includeOptions['includepolicies']" />\r
							<label for="enableImportPolicies" class="radio-label"\r
								>Security policies</label\r
							>\r
						</div>\r
					</div>\r
\r
					<div class="compound-field">\r
						<div class="field switch">\r
							<input\r
								type="checkbox"\r
								name="enableImportMemos"\r
								class="switch"\r
								id="enableImportMemos"\r
								[(ngModel)]="includeOptions['includememos']" />\r
							<label for="enableImportMemos" class="radio-label"\r
								>Announcements</label\r
							>\r
						</div>\r
					</div>\r
				</div>\r
			</div>\r
\r
			<button\r
				class="btn-secondary"\r
				[disabled]="isBusy"\r
				(click)="upload()"\r
				id="lm-a-imp-upload">\r
				Upload\r
			</button>\r
			<button\r
				class="btn-secondary lm-margin-md-t"\r
				[disabled]="!isBusy || isCancelled"\r
				(click)="cancel()"\r
				id="lm-a-imp-cancel">\r
				Cancel\r
			</button>\r
			<button\r
				class="btn-primary e2e-import-btn"\r
				[disabled]="isBusy || !isImportEnabled"\r
				(click)="onClickImport()"\r
				id="lm-a-imp-import">\r
				Import\r
			</button>\r
\r
			<div class="row lm-margin-xl-t" *ngIf="statusMessageList.length > 0">\r
				<hr />\r
				<ul class="lm-margin-md-t lm-margin-md-l">\r
					<li\r
						*ngFor="let item of statusMessageList"\r
						class="lm-admin-base-font-size"\r
						[class.lm-fontweight-bold]="isMaxLimitMessage(item.message)">\r
						{{ item.message }}\r
					</li>\r
				</ul>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var Fa,In=(Fa=class extends R{constructor(e,t,i,s,a,o){super(e,s),this.logPrefix=e,this.adminContext=t,this.adminService=i,this.sohoModalDialogService=a,this.settingsService=o,this.includeOptions={},this.isImportEnabled=!1,this.isAllSelected=!0,this.isCancelled=!1,this.subscriptions=new nt,this.initDefaults(t),this.subscriptions.add(this.settingsService.features$.subscribe(n=>{this.updateSettingControlledValues(n)}))}ngOnDestroy(){this.subscriptions.unsubscribe()}clearMessages(){this.statusMessageList=[]}updateSettingControlledValues(e){let t=u.itemByProperty(e,"settingName",K.featureStandardPages);t&&(this.isStandardPagesEnabled=t.value==="true")}handleChange(e,t){e||(t===M.parameterIncludeSettings?this.includeOptions[M.parameterIncludeSettingsRules]=!1:t===M.parameterIncludePublishedWidgets?this.includeOptions[M.parameterIncludePublishedWidgetAccess]=!1:t===M.parameterIncludePublishedPages&&(this.includeOptions[M.parameterIncludePublishedPageAccess]=!1,this.includeOptions[M.parameterIncludePublishedPageConnections]=!1))}onSelectDeselectAll(e){let t=this.includeOptions,i=Object.keys(t);for(let s of i)W.isBoolean(t[s])&&(t[s]=e)}checkStatus(e){let t=this;t.adminService.getOperationStatus().subscribe(i=>{let s=i.content;t.updateMessages(s),s&&s.isRunning?(this.isCancelled=!1,setTimeout(()=>t.checkStatus(e),M.checkStatusInterval)):(t.setBusy(!1),e&&e())},i=>{let s=i.content;t.updateMessages(s),s&&s.isRunning?setTimeout(()=>t.checkStatus(e),M.checkStatusInterval):(t.setBusy(!1),e&&e(),i.hasError()&&t.adminService.showUploadCompleteDialog("Error",i.toErrorLog(),!0))})}cancel(){let e=this;this.isCancelled=!0,e.adminService.cancelOperation().subscribe(t=>{e.updateMessages(t.content)},t=>{this.isCancelled=!1,e.setBusy(!1),e.adminService.showUploadCompleteDialog("Error",t.toErrorLog(),!0)})}verifyOptions(){this.isStandardPagesEnabled||(this.includeOptions.includestandardpageaccess=!1)}hasIncludes(){let e=this.includeOptions;for(let t in e)if(e.hasOwnProperty(t)&&e[t]===!0)return!0;return!1}updateMessages(e){e&&e.messageList&&(this.statusMessageList=e.messageList)}initDefaults(e){this.clearMessages();let t=this.includeOptions,i=M;if(t[i.parameterIncludeSettings]=!0,t[i.parameterIncludeSettingsRules]=!0,t[i.parameterIncludeUserSettings]=!0,t[i.parameterIncludeProperties]=!0,t[i.parameterIncludePublishedWidgets]=!0,t[i.parameterIncludePublishedWidgetAccess]=!0,t[i.parameterIncludeStandardWidgetAccess]=!0,t[i.parameterIncludePublishedPages]=!0,t[i.parameterIncludePublishedPageConnections]=!0,t[i.parameterIncludePublishedPageAccess]=!0,t[i.parameterIncludePrivatePages]=!0,t[i.parameterIncludeStandardPageAccess]=!0,t[i.parameterIncludeMemos]=!0,t[i.parameterIncludePolicies]=!0,e){let s=e.get();if(s){let a=s.settings;a&&this.updateSettingControlledValues(a)}}}},Fa.ctorParameters=()=>[{type:String},{type:O},{type:y},{type:b},{type:w},{type:be}],Fa);In=d([Ue()],In);var Ki,Ba=(Ki=class extends In{constructor(e,t,i,s,a){super("AdminExportComponent",e,t,i,s,a),this.adminContext=e,this.adminService=t,this.sohoModalDialogService=s,this.isBusy=!1}ngOnInit(){this.updateFileInfo()}onClickExport(){this.verifyOptions(),this.hasIncludes()?(this.clearMessages(),this.exportData()):this.showMessage("No data included","Please select data to export.")}exportData(){this.setBusy(!0),this.isCancelled=!1,this.adminService.startExportOperation(this.includeOptions).subscribe(e=>{e.content.isRunning?this.checkStatus(()=>this.updateFileInfo()):this.setBusy(!1)},e=>{this.setBusy(!1),this.adminService.showUploadCompleteDialog("Export Error",e.toErrorLog(),!0)})}download(){this.adminService.downloadExportFile()}confirmDelete(){this.showConfirm("Confirm delete","Are you sure that you want to delete the exported file?").subscribe(()=>{this.delete()})}setBusy(e){this.isBusy=e}updateFileInfo(){this.setBusy(!0),this.adminService.getExportFileInfo().subscribe(e=>{this.onFileInfo(e),this.setBusy(!1)},()=>{this.setBusy(!1)})}delete(){this.setBusy(!0),this.adminService.deleteExportFile().subscribe(()=>{this.fileExists=!1,this.fileMessage=null,this.setBusy(!1)},()=>{this.setBusy(!1),this.showError("Unable to delete","The file could not be deleted.")})}onFileInfo(e){this.fileExists=e.exists,e.exists?this.fileMessage="An export file created "+de.dateToString(e.changeDate)+" is available for download.":this.fileMessage=""}},Ki.ctorParameters=()=>[{type:O},{type:y},{type:b},{type:w},{type:be}],Ki.propDecorators={content:[{type:f,args:["lmAdminExport",{read:A,static:!1}]}]},Ki);Ba=d([p({selector:"lm-admin-export",template:ul})],Ba);var es,Ua=(es=class extends In{constructor(e,t,i,s,a){super("AdminImportComponent",e,t,i,s,a),this.adminContext=e,this.adminService=t,this.sohoModalDialogService=s,this.isBusy=!1}upload(){this.clearMessages();let e="Upload Homepages Data",t=this.adminService,i={title:e,operation:bn.importData,buttonText:"Upload"};t.openImportFilesDialog(i,this.content).subscribe(s=>{let a=s.value;if(s.button===C.Yes&&a.responseCode===Q.Success){let o=a.message?a.message:"The file was successfully uploaded to the server.";t.showUploadCompleteDialog(e,o),this.isImportEnabled=!0}else s.button===C.Yes&&a.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,a.message,!0)})}onClickImport(){this.verifyOptions(),this.hasIncludes()?(this.showConfirmImport(),this.clearMessages(),this.isImportEnabled=!1):this.showMessage("No data included","Please select data to import.")}showConfirmImport(){this.showConfirm("Import Homepages Data","Are you sure you want to start an import operation?").subscribe(()=>{this.importData()})}setBusy(e){this.isBusy=e}isMaxLimitMessage(e){return e.indexOf("The maximum number of")!==-1}importData(){let e=this,t=e.includeOptions;e.setBusy(!0),e.isCancelled=!0,e.adminService.startImportOperation(t).subscribe(i=>{if(i.content.isRunning){let s=()=>{e.onImported(t)};e.checkStatus(s)}else e.setBusy(!1)},i=>{e.setBusy(!1),e.adminService.showUploadCompleteDialog("Import Error",i.toErrorLog(),!0)})}onImported(e){this.adminService.invalidateCaches(e)}},es.ctorParameters=()=>[{type:O},{type:y},{type:b},{type:w},{type:be}],es.propDecorators={content:[{type:f,args:["lmAdminImport",{read:A,static:!1}]}]},es);Ua=d([p({selector:"lm-admin-import",template:gl})],Ua);var bl=`<div class="row lm-margin-xl-t" style="min-width: 500px">\r
	<div class="twelve columns">\r
		<label class="label">{{ description }}</label>\r
\r
		<div\r
			soho-datagrid\r
			#languageDatagrid\r
			id="lm-a-ls-g"\r
			[gridOptions]="datagridOptions"\r
			[data]="datagridOptions.dataset"\r
			(selected)="updateSelection($event.rows)"></div>\r
	</div>\r
</div>\r
<div class="modal-buttonset">\r
	<button class="btn-modal" (click)="cancel()" id="lm-a-ls-cancel">\r
		Cancel\r
	</button>\r
	<button\r
		class="btn-modal-primary"\r
		[disabled]="!selection || selection.length < 1"\r
		(click)="save()"\r
		id="lm-a-ls-ok">\r
		OK\r
	</button>\r
</div>\r
`;var is,ts=(is=class extends q{constructor(e,t,i,s,a,o,n,r){super("LanguageSelectorDialog","language",e,t,s,a,o,{}),this.commonDataService=i,this.adminContext=n,this.dialogService=r,this.canSave=!1}ngOnInit(){this.initGrid(),this.commonDataService.listLanguages().subscribe(e=>{this.updateLanguages(e.content)},()=>{})}cancel(){this.dialog.close()}save(){let e=this.selection.map(t=>t.data);this.dialog.close(e)}getDataGrid(){return this.dataGrid}updateLanguages(e){let i=new Rr(this.languageService.getLanguage()).toList(e);this.addItems(i,null)}initGrid(){let e={selectable:"multiple",rowHeight:"medium",disableRowDeactivation:!0,clickToSelect:!1,columns:[{width:50,id:"selectionCheckbox",field:"",name:"",sortable:!1,resizable:!1,formatter:Formatters.SelectionCheckbox,align:"center"},{width:200,id:"lm-a-ls-col-t",field:"name",name:"Language",sortable:!0,resizable:!0},{width:215,id:"lm-a-ls-col-c",field:"native",name:"Description",sortable:!0,resizable:!0}],dataset:this.items||[]};this.datagridOptions=e}},is.ctorParameters=()=>[{type:b},{type:L},{type:xe},{type:y},{type:w},{type:B},{type:O},{type:$e}],is.propDecorators={dataGrid:[{type:f,args:["languageDatagrid",{static:!1}]}]},is);ts=d([p({template:bl})],ts);var fl=`<div class="basic">\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-t-lbl" for="lm-a-mm-bsc-t" class="required"\r
			>Title</label\r
		>\r
		<input\r
			id="lm-a-mm-bsc-t"\r
			type="text"\r
			maxlength="{{ titleMaxLength }}"\r
			[(ngModel)]="memo.title"\r
			data-validate="required" />\r
	</div>\r
\r
	<div class="field markdown-editor-field">\r
		<label id="lm-a-mm-bsc-tx-lbl" for="lm-a-mm-bsc-tx"\r
			>Content\r
			<svg\r
				id="lm-a-mm-bsc-tx-svg"\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				*ngIf="isImageOnly()"\r
				soho-tooltip\r
				title="Content will not be visible since Image only layout is used"></svg>\r
		</label>\r
		<lm-markdown-editor\r
			[(model)]="memo.text"\r
			[help]="true"\r
			[preview]="true"\r
			[toolbar]="true"\r
			[maxLength]="textMaxLength"\r
			[support]="{\r
				bold: true,\r
				emphasis: true,\r
				strikethrough: true,\r
				links: true\r
			}"\r
			[showCharacterCount]="true"\r
			style="width: 500px"\r
			id="lm-a-mm-bsc-tx">\r
		</lm-markdown-editor>\r
	</div>\r
\r
	<div class="field">\r
		<label for="lm-a-mm-dr-from" id="lm-a-mm-dr-from-lbl" class="label required"\r
			>Available from</label\r
		>\r
		<input\r
			soho-datepicker\r
			id="lm-a-mm-dr-from"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-dr-from' }"\r
			style="width: 500px"\r
			name="start"\r
			showTime="true"\r
			minuteInterval="1"\r
			mode="standard"\r
			[(ngModel)]="start"\r
			data-validate="date availableDate required" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="lm-a-mm-dr-to" id="lm-a-mm-dr-to-lbl" class="label required"\r
			>Available to</label\r
		>\r
		<input\r
			soho-datepicker\r
			id="lm-a-mm-dr-to"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-dr-to' }"\r
			style="width: 500px"\r
			name="end"\r
			showTime="true"\r
			minuteInterval="1"\r
			mode="standard"\r
			[(ngModel)]="end"\r
			data-validate="date availableDate required" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="lm-a-mm-dr-tz" id="lm-a-mm-dr-tz-lbl" class="label"\r
			>Time zone</label\r
		>\r
		<select\r
			soho-dropdown\r
			name="lm-a-mm-dr-tz"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-dr-timezone' }"\r
			style="width: 500px"\r
			[(ngModel)]="timeZone">\r
			<option *ngFor="let zone of timeZones" [ngValue]="zone.id">\r
				{{ zone.name }}\r
			</option>\r
		</select>\r
	</div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-iu-lbl" for="lm-a-mm-bsc-iu">Image URL</label>\r
		<input\r
			id="lm-a-mm-bsc-iu"\r
			type="text"\r
			maxlength="{{ UrlMaxLength }}"\r
			[(ngModel)]="imageUrl" />\r
	</div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-ia-lbl" for="lm-a-mm-bsc-ia">Image Alignment</label>\r
		<select\r
			soho-dropdown\r
			name="lm-a-mm-bsc-ia"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-bsc-imagealignment' }"\r
			[(ngModel)]="memo.imageAlignment">\r
			<option [ngValue]="alignment.Center">Center</option>\r
			<option [ngValue]="alignment.Cover">Cover</option>\r
			<option [ngValue]="alignment.Fill">Fill</option>\r
			<option [ngValue]="alignment.Fit">Fit</option>\r
		</select>\r
	</div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-l-lbl" for="lm-a-mm-bsc-l">Layout</label>\r
		<select\r
			soho-dropdown\r
			name="lm-a-mm-bsc-l"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-bsc-layout' }"\r
			[(ngModel)]="layout">\r
			<option [ngValue]="layoutOption.BackgroundImage">Background Image</option>\r
			<option [ngValue]="layoutOption.TextFirst">Text First</option>\r
			<option [ngValue]="layoutOption.ImageFirst">Image First</option>\r
			<option [ngValue]="layoutOption.ImageOnly">Image Only</option>\r
		</select>\r
	</div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-tc-lbl">Foreground color</label>\r
		<input\r
			soho-radiobutton\r
			type="radio"\r
			id="lm-a-mm-bsc-tc-dark"\r
			value="dark"\r
			[(ngModel)]="memo.textColor"\r
			[attr.disabled]="textColorDisabledAttr" />\r
		<label soho-label for="lm-a-mm-bsc-tc-dark" [forRadioButton]="true"\r
			>Dark</label\r
		>\r
		<br />\r
		<input\r
			soho-radiobutton\r
			type="radio"\r
			id="lm-a-mm-bsc-tc-light"\r
			value="light"\r
			[(ngModel)]="memo.textColor"\r
			[attr.disabled]="textColorDisabledAttr" />\r
		<label soho-label for="lm-a-mm-bsc-tc-light" [forRadioButton]="true"\r
			>Light</label\r
		>\r
		<br />\r
		<input\r
			soho-radiobutton\r
			type="radio"\r
			id="lm-a-mm-bsc-tc-default"\r
			value="default"\r
			[(ngModel)]="memo.textColor"\r
			[attr.disabled]="textColorDisabledAttr" />\r
		<label soho-label for="lm-a-mm-bsc-tc-default" [forRadioButton]="true"\r
			>Default</label\r
		>\r
	</div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-bsc-pr-lbl" for="lm-a-mm-bsc-pr">Priority</label>\r
		<select\r
			soho-dropdown\r
			name="lm-a-mm-bsc-pr"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-bsc-priority' }"\r
			[(ngModel)]="memo.priority">\r
			<option [ngValue]="prio.Default">Default</option>\r
			<option [ngValue]="prio.Important">Important</option>\r
			<option [ngValue]="prio.Critical">Critical</option>\r
		</select>\r
	</div>\r
\r
	<div class="field">\r
		<div class="switch">\r
			<input\r
				class="switch"\r
				id="lm-a-mm-bsc-ab"\r
				type="checkbox"\r
				[(ngModel)]="showActionButton" />\r
			<label id="lm-a-mm-bsc-ab-lbl" for="lm-a-mm-bsc-ab"\r
				>Show action button</label\r
			>\r
		</div>\r
	</div>\r
\r
	<div class="field" *ngIf="showActionButton">\r
		<label id="lm-a-mm-bsc-at-lbl" for="lm-a-mm-bsc-at" class="required"\r
			>Button title</label\r
		>\r
		<input\r
			type="text"\r
			id="lm-a-mm-bsc-at"\r
			maxlength="{{ actionTextMaxLength }}"\r
			[(ngModel)]="memo.actionText"\r
			[disabled]="!showActionButton"\r
			data-validate="required" />\r
	</div>\r
\r
	<div class="field" *ngIf="showActionButton">\r
		<label id="lm-a-mm-bsc-au-lbl" for="lm-a-mm-bsc-au" class="required"\r
			>Button URL</label\r
		>\r
		<input\r
			type="text"\r
			id="lm-a-mm-bsc-au"\r
			maxlength="{{ UrlMaxLength }}"\r
			[(ngModel)]="memo.actionUrl"\r
			data-validate="required" />\r
	</div>\r
</div>\r
`;var yl=`.basic{min-width:520px;width:100%}.markdown-editor-field{margin-bottom:40px}lm-markdown-editor{min-height:150px}.markdown-editor-field>label>svg{margin-left:5px;margin-right:5px;margin-top:-5px}
/*# sourceMappingURL=basic.css.map */
`;var Ut=class m{get title(){return this.data.t}set title(e){this.data.t=e}get text(){return this.data.tx}set text(e){this.data.tx=e}get actionText(){return this.data.at}set actionText(e){this.data.at=e}get actionUrl(){return this.data.au}set actionUrl(e){this.data.au=e}get imageUrl(){return this.data.iu}set imageUrl(e){this.data.iu=e}get imageAlignment(){return this.data.ia}set imageAlignment(e){this.data.ia=e}get textColor(){return this.data.tc}set textColor(e){this.data.tc=e}get memoId(){return this.data.mid}set memoId(e){this.data.mid=e}get entityType(){return this.data.et}set entityType(e){this.data.et=e}get mainType(){switch(this.data.mt){case 0:return It.Default;case 1:return It.Recurring}}set mainType(e){switch(e){case It.Default:this.data.mt=0;break;case It.Recurring:this.data.mt=1;break;default:throw new TypeError(`${e} is not a valid mainType`)}}get subType(){return this.data.st}set subType(e){this.data.st=e}get startDate(){return this.data.sd}set startDate(e){this.data.sd=e}get endDate(){return this.data.ed}set endDate(e){this.data.ed=e}get timeZone(){return this.data.tz}set timeZone(e){this.data.tz=e}get priority(){return this.data.pr}set priority(e){this.data.pr=e}get priorityText(){switch(this.data.pr){case ca.Important:return"Important";case ca.Critical:return"Critical";default:return"Default"}}get accessIds(){return this.data.ais}set accessIds(e){this.data.ais=e}get hasAccess(){let e=this.data.ais;return e&&e.length>0}get changedByName(){return this.data.cbn}get changeDate(){return this.data.cd}get dateRangeStatus(){return this.data.sts}get iterationStatus(){return this.data.ists}get localization(){return this.data.lzn}set localization(e){this.data.lzn=e}get layout(){return this.data.ly}set layout(e){this.data.ly=e}constructor(e={}){this.data=e,this.setDefaults(),this.iteration=new Qn(this.data.it)}static copy(e){return new m(e.toData())}normalize(){this.imageUrl&&(this.imageUrl=this.imageUrl.trim()),this.imageUrl||(this.textColor="default"),this.title&&(this.title=this.title.trim()),this.actionText&&(this.actionText=this.actionText.trim()),this.actionUrl&&(this.actionUrl=this.actionUrl.trim())}validateMandatory(e){return e&&!(this.actionText&&this.actionUrl)?!1:!!(this.title&&this.startDate&&this.endDate)}toData(){return this.minifyData(v.copy(this.data))}minifyData(e){return te(D({},e),{it:e.mt===1?this.iteration.getData():void 0})}setDefaults(){Je(this.data,"mt",0)}},It;(function(m){m.Default="Default",m.Recurring="Recurring"})(It||(It={}));var Qn=class{get frequency(){switch(this.data.f){case 0:return ce.None;case 1:return ce.Weekly;case 2:return ce.Monthly;case 3:return ce.Yearly}}set frequency(e){switch(e){case ce.None:this.data.f=0;break;case ce.Weekly:this.data.f=1;break;case ce.Monthly:this.data.f=2;break;case ce.Yearly:this.data.f=3;break;default:throw new TypeError(`'${e}' is not a valid frequency.`)}this.limitEvery()}get isWeekly(){return this.frequency===ce.Weekly}get isMonthly(){return this.frequency===ce.Monthly}get frequencyType(){switch(this.data.ft){case 0:return Xe.None;case 1:return Xe.Absolute;case 2:return Xe.Relative}}set frequencyType(e){switch(e){case Xe.None:this.data.ft=0;break;case Xe.Absolute:this.data.ft=1;break;case Xe.Relative:this.data.ft=2;break;default:throw new TypeError(`'${e}' is not a valid frequencyType.`)}this.limitEvery()}get weekDay(){switch(this.data.wd){case 1:return _.Monday;case 2:return _.Tuesday;case 3:return _.Wednesday;case 4:return _.Thursday;case 5:return _.Friday;case 6:return _.Saturday;case 7:return _.Sunday}}set weekDay(e){switch(e){case _.Monday:this.data.wd=1;break;case _.Tuesday:this.data.wd=2;break;case _.Wednesday:this.data.wd=3;break;case _.Thursday:this.data.wd=4;break;case _.Friday:this.data.wd=5;break;case _.Saturday:this.data.wd=6;break;case _.Sunday:this.data.wd=7;break;default:throw new TypeError(`${e} is not a valid weekDay`)}}get weekDays(){return this.data.wds}set weekDays(e){this.data.wds=e}get daysBefore(){return this.data.db}set daysBefore(e){this.data.db=ma.int(e,0,99)}get daysAfter(){return this.data.da}set daysAfter(e){this.data.da=ma.int(e,0,99)}get every(){return this.data.e}set every(e){let t=1;this.isWeekly?t=52:this.isMonthly&&(t=12),this.data.e=ma.int(e,1,t)}get dayOfMonth(){return this.data.dom}set dayOfMonth(e){this.data.dom=ma.int(e,1,31)}get month(){switch(this.data.m){case 0:return ee.None;case 1:return ee.January;case 2:return ee.February;case 3:return ee.March;case 4:return ee.April;case 5:return ee.May;case 6:return ee.June;case 7:return ee.July;case 8:return ee.August;case 9:return ee.September;case 10:return ee.October;case 11:return ee.November;case 12:return ee.December}}set month(e){switch(e){case ee.None:this.data.m=0;break;case ee.January:this.data.m=1;break;case ee.February:this.data.m=2;break;case ee.March:this.data.m=3;break;case ee.April:this.data.m=4;break;case ee.May:this.data.m=5;break;case ee.June:this.data.m=6;break;case ee.July:this.data.m=7;break;case ee.August:this.data.m=8;break;case ee.September:this.data.m=9;break;case ee.October:this.data.m=10;break;case ee.November:this.data.m=11;break;case ee.December:this.data.m=12;break;default:throw new TypeError(`${e} is not a valid month`)}}get weekOrdinal(){switch(this.data.wo){case 0:return Ae.None;case 1:return Ae.First;case 2:return Ae.Second;case 3:return Ae.Third;case 4:return Ae.Fourth;case 5:return Ae.Last}}set weekOrdinal(e){switch(e){case Ae.None:this.data.wo=0;break;case Ae.First:this.data.wo=1;break;case Ae.Second:this.data.wo=2;break;case Ae.Third:this.data.wo=3;break;case Ae.Fourth:this.data.wo=4;break;case Ae.Last:this.data.wo=5;break;default:throw new TypeError(`'${e}' is not a valid weekOrdinal.`)}}get firstDayOfWeek(){switch(this.data.fdw){case 1:return _.Monday;case 2:return _.Tuesday;case 3:return _.Wednesday;case 4:return _.Thursday;case 5:return _.Friday;case 6:return _.Saturday;case 7:return _.Sunday}}set firstDayOfWeek(e){switch(e){case _.Monday:this.data.fdw=1;break;case _.Tuesday:this.data.fdw=2;break;case _.Wednesday:this.data.fdw=3;break;case _.Thursday:this.data.fdw=4;break;case _.Friday:this.data.fdw=5;break;case _.Saturday:this.data.fdw=6;break;case _.Sunday:this.data.fdw=7;break;default:throw new TypeError(`${e} is not a valid firstDayOfWeek`)}}constructor(e={}){this.data=e,this.setDefaults()}getData(){return this.data}limitEvery(){this.every=this.data.e}setDefaults(){Je(this.data,"da",0),Je(this.data,"db",0),Je(this.data,"dom",1),Je(this.data,"e",1),Je(this.data,"f",0),Je(this.data,"fdw",this.getLocaleFirstDayOfWeek()),Je(this.data,"ft",1),Je(this.data,"m",1),Je(this.data,"wd",1),Je(this.data,"wds",[0,0,0,0,0,0,0]),Je(this.data,"wo",1)}getLocaleFirstDayOfWeek(){let e=Soho.Locale.calendar().firstDayofWeek||0;return e===0?7:e}},ce;(function(m){m.None="0",m.Weekly="1",m.Monthly="2",m.Yearly="3"})(ce||(ce={}));var Xe;(function(m){m.None="0",m.Absolute="1",m.Relative="2"})(Xe||(Xe={}));var Ae;(function(m){m.None="None",m.First="First",m.Second="Second",m.Third="Third",m.Fourth="Fourth",m.Last="Last"})(Ae||(Ae={}));var _;(function(m){m.Monday="Monday",m.Tuesday="Tuesday",m.Wednesday="Wednesday",m.Thursday="Thursday",m.Friday="Friday",m.Saturday="Saturday",m.Sunday="Sunday"})(_||(_={}));var ee;(function(m){m.None="None",m.January="January",m.February="February",m.March="March",m.April="April",m.May="May",m.June="June",m.July="July",m.August="August",m.September="September",m.October="October",m.November="November",m.December="December"})(ee||(ee={}));var Bt=class Bt{};Bt.MaxLengthTitle=128,Bt.MaxLengthActionText=40,Bt.MaxLengthText=512,Bt.LocalizationKeyTitle="t",Bt.LocalizationKeyText="tx",Bt.LocalizationKeyActionText="at";var Ze=Bt;function Je(m,e,t){(m[e]===null||m[e]===void 0)&&(m[e]=t)}var ss,ni=(ss=class extends R{constructor(e){super("MemoBasicComponent"),this.contextService=e,this.alignment=vt,this.layoutOption=kt,this.prio=ca,this.titleMaxLength=Ze.MaxLengthTitle,this.textMaxLength=Ze.MaxLengthText,this.UrlMaxLength=2048,this.actionTextMaxLength=Ze.MaxLengthActionText,this.timeZones=E.getTimeZones()}ngOnInit(){this.memo.title||(this.memo.priority=0,this.memo.imageAlignment=vt.Cover,this.memo.layout=kt.BackgroundImage,this.memo.textColor="default",this.textColorIndex=0),this.showActionButton=!!this.memo.actionText,this.start||(this.start=de.dateToString(de.today())),this.end||(this.end=de.dateToString(de.weekFromNow())),this.memo.timeZone||(this.memo.timeZone=this.contextService.getContext().getInforStdTimeZone()||"UTC")}get imageUrl(){return this.memo.imageUrl}set imageUrl(e){this.memo.imageUrl=e,e||(this.memo.textColor="default")}get layout(){return this.memo.layout}set layout(e){isNaN(e)||(this.memo.layout=e,e!==kt.BackgroundImage&&e!==kt.ImageOnly&&(this.memo.textColor="default"))}get textColorDisabledAttr(){return this.memo.imageUrl&&(this.memo.layout===kt.BackgroundImage||this.memo.layout===kt.ImageOnly)?null:""}isImageOnly(){return this.memo.layout===kt.ImageOnly}get start(){return this.dateMemoToIds(this.memo.startDate)}set start(e){this.memo.startDate=e?this.dateIdsToMemo(e):null}get end(){return this.dateMemoToIds(this.memo.endDate)}set end(e){this.memo.endDate=e?this.dateIdsToMemo(e):null}get timeZone(){return this.memo.timeZone}set timeZone(e){this.memo.timeZone=e}dateMemoToIds(e){return de.parseToString(e)}dateIdsToMemo(e){let t=de.parseLocaleDate(e);if(t)return E.toIsoDateTimeLocal(t)}},ss.ctorParameters=()=>[{type:ct}],ss.propDecorators={memo:[{type:h}]},ss);ni=d([p({selector:"lm-admin-memo-basic",template:fl,styles:[yl]})],ni);var vl=`:host ::ng-deep input.lm-input-xxs{width:40px;margin:0 5px}:host ::ng-deep select.lm-dropdown-mds,:host ::ng-deep select.lm-dropdown-mds+div.dropdown-wrapper .dropdown-md{width:120px;margin:0 5px}:host ::ng-deep select.lm-dropdown-mds+div.dropdown-wrapper{margin:0}:host ::ng-deep label[soho-label]>.vertical-adjust{margin-top:-5px;margin-bottom:5px}.recurrence-container{max-width:500px}
/*# sourceMappingURL=date.css.map */
`;var xl=`<div class="field">\r
	<label soho-label>Recurrence</label>\r
	<ng-container *ngFor="let option of recurrenceOptions">\r
		<input\r
			type="radio"\r
			soho-radiobutton\r
			(change)="recurrenceChanged(option.value)"\r
			[(ngModel)]="recurrence"\r
			[id]="option.id"\r
			[name]="option.id"\r
			[value]="option.value" />\r
		<label soho-label [for]="option.id" [forRadioButton]="true">{{\r
			option.label\r
		}}</label>\r
		<br />\r
	</ng-container>\r
</div>\r
<ng-container *ngIf="showRecurrencePatterns">\r
	<label soho-label>Recurrence pattern</label>\r
	<div *ngIf="showWeekRecurrence" class="recurrence-container">\r
		<lm-admin-memo-date-weekly\r
			[iteration]="memo.iteration"></lm-admin-memo-date-weekly>\r
	</div>\r
	<div *ngIf="showMonthRecurrence" class="recurrence-container">\r
		<lm-admin-memo-date-monthly\r
			[iteration]="memo.iteration"></lm-admin-memo-date-monthly>\r
	</div>\r
	<div *ngIf="showYearRecurrence" class="recurrence-container">\r
		<lm-admin-memo-date-yearly\r
			[iteration]="memo.iteration"></lm-admin-memo-date-yearly>\r
	</div>\r
</ng-container>\r
`;var as,za=(as=class extends R{constructor(){super("MemoDateComponent"),this.recurrenceOptions=[{id:"lm-a-mm-dr-rec-no",label:"No recurrence",value:ce.None},{id:"lm-a-mm-dr-rec-weekly",label:"Weekly",value:ce.Weekly},{id:"lm-a-mm-dr-rec-monthly",label:"Monthly",value:ce.Monthly},{id:"lm-a-mm-dr-rec-yearly",label:"Yearly",value:ce.Yearly}]}recurrenceChanged(e){e===ce.None?this.memo.mainType=It.Default:this.memo.mainType=It.Recurring}get recurrence(){return this.memo.iteration.frequency}set recurrence(e){this.memo.iteration.frequency=e}get showRecurrencePatterns(){return this.recurrence!==ce.None}get showWeekRecurrence(){return this.recurrence===ce.Weekly}get showMonthRecurrence(){return this.recurrence===ce.Monthly}get showYearRecurrence(){return this.recurrence===ce.Yearly}},as.ctorParameters=()=>[],as.propDecorators={memo:[{type:h}]},as);za=d([p({selector:"lm-admin-memo-date",template:xl,styles:[vl]})],za);var Sl=`<div class="field">\r
	<input\r
		type="radio"\r
		soho-radiobutton\r
		[(ngModel)]="iteration.frequencyType"\r
		id="lm-a-mm-dr-rec-monthly-abs"\r
		name="lm-a-mm-dr-rec-monthly-abs"\r
		[value]="FrequencyTypes.Absolute" />\r
	<label soho-label for="lm-a-mm-dr-rec-monthly-abs" [forRadioButton]="true">\r
		<div class="vertical-adjust">\r
			Day\r
			<input\r
				type="number"\r
				lm-number-mask\r
				min="1"\r
				max="31"\r
				maxlength="2"\r
				[onlyIntegers]="true"\r
				class="lm-input-xxs"\r
				[(ngModel)]="iteration.dayOfMonth"\r
				[ngModelOptions]="{ updateOn: 'blur' }"\r
				(focus)="onFocus($event)" />\r
			of every\r
			<input\r
				type="number"\r
				lm-number-mask\r
				[onlyIntegers]="true"\r
				min="1"\r
				max="12"\r
				maxlength="2"\r
				class="lm-input-xxs"\r
				[(ngModel)]="iteration.every"\r
				[ngModelOptions]="{ updateOn: 'blur' }"\r
				(focus)="onFocus($event)" />\r
			month(s)\r
		</div>\r
	</label>\r
	<br />\r
	<input\r
		type="radio"\r
		soho-radiobutton\r
		[(ngModel)]="iteration.frequencyType"\r
		id="lm-a-mm-dr-rec-monthly-rel"\r
		name="lm-a-mm-dr-rec-monthly-rel"\r
		[value]="FrequencyTypes.Relative" />\r
	<label soho-label for="lm-a-mm-dr-rec-monthly-rel" [forRadioButton]="true">\r
		<div class="vertical-adjust">\r
			The\r
			<select\r
				soho-dropdown\r
				class="lm-dropdown-mds"\r
				name="lm-a-mm-dr-rec-monthly-rel-nth"\r
				[attributes]="{ name: 'id', value: 'lm-a-mm-dr-rec-monthly-rel-nth' }"\r
				noSearch\r
				[(ngModel)]="iteration.weekOrdinal">\r
				<option [value]="WeekOrdinals.First">First</option>\r
				<option [value]="WeekOrdinals.Second">Second</option>\r
				<option [value]="WeekOrdinals.Third">Third</option>\r
				<option [value]="WeekOrdinals.Fourth">Fourth</option>\r
				<option [value]="WeekOrdinals.Last">Last</option>\r
			</select>\r
			<lm-admin-memo-weekday-select\r
				[(model)]="iteration.weekDay"></lm-admin-memo-weekday-select>\r
			of every\r
			<input\r
				type="number"\r
				lm-number-mask\r
				[onlyIntegers]="true"\r
				min="1"\r
				max="12"\r
				maxlength="2"\r
				class="lm-input-xxs"\r
				[(ngModel)]="iteration.every"\r
				[ngModelOptions]="{ updateOn: 'blur' }"\r
				(focus)="onFocus($event)" />\r
			month(s)\r
		</div>\r
	</label>\r
</div>\r
<div class="field">\r
	<label soho-label>Duration</label>\r
	<p>\r
		Announcement is displayed\r
		<input\r
			type="number"\r
			lm-number-mask\r
			[onlyIntegers]="true"\r
			min="0"\r
			max="99"\r
			maxlength="2"\r
			class="lm-input-xxs"\r
			[(ngModel)]="iteration.daysBefore"\r
			[ngModelOptions]="{ updateOn: 'blur' }"\r
			(focus)="onFocus($event)" />\r
		day(s) before and\r
		<input\r
			type="number"\r
			lm-number-mask\r
			[onlyIntegers]="true"\r
			min="0"\r
			max="99"\r
			maxlength="2"\r
			class="lm-input-xxs"\r
			[(ngModel)]="iteration.daysAfter"\r
			[ngModelOptions]="{ updateOn: 'blur' }"\r
			(focus)="onFocus($event)" />\r
		day(s) after\r
	</p>\r
</div>\r
`;var os,Wa=(os=class extends R{constructor(){super("MemoDateMonthlyComponent"),this.FrequencyTypes=Xe,this.WeekOrdinals=Ae}onFocus(e){e.target.select()}},os.ctorParameters=()=>[],os.propDecorators={iteration:[{type:h}]},os);Wa=d([p({selector:"lm-admin-memo-date-monthly",template:Sl})],Wa);var Cl=`<p>\r
	First day of week\r
	<lm-admin-memo-weekday-select\r
		[(model)]="iteration.firstDayOfWeek"\r
		(modelChange)="firstDayChanged()"></lm-admin-memo-weekday-select>\r
</p>\r
<p>\r
	Recur every\r
	<input\r
		type="number"\r
		lm-number-mask\r
		[onlyIntegers]="true"\r
		min="1"\r
		max="52"\r
		maxlength="2"\r
		class="lm-input-xxs"\r
		[(ngModel)]="recurEvery"\r
		[ngModelOptions]="{ updateOn: 'blur' }"\r
		(focus)="onFocus($event)" />\r
	week(s) on:\r
</p>\r
<div class="compound-field">\r
	<div\r
		class="field"\r
		[style.margin-bottom]="0"\r
		*ngFor="let checkbox of dayCheckboxes">\r
		<input\r
			type="checkbox"\r
			[name]="checkbox.id"\r
			[id]="checkbox.id"\r
			(change)="checkboxChanged(checkbox)"\r
			[(ngModel)]="checkbox.checked"\r
			soho-checkbox />\r
		<label soho-label [attr.for]="checkbox.id" [forCheckBox]="true">{{\r
			checkbox.label\r
		}}</label>\r
	</div>\r
</div>\r
`;var ns,Ga=(ns=class extends R{constructor(){super("MemoDateWeeklyComponent")}ngOnInit(){this.setupCheckboxes()}onFocus(e){e.target.select()}checkboxChanged(e){this.iteration.weekDays[e.dayIndex]=e.checked?1:0}firstDayChanged(){this.setupCheckboxes()}get recurEvery(){return this.iteration.every}set recurEvery(e){this.iteration.every=e}setupCheckboxes(){let e=[{checked:!!this.iteration.weekDays[0],day:_.Monday,dayIndex:0,id:"lm-a-mm-dr-rec-weekly-Monday",label:"Monday"},{checked:!!this.iteration.weekDays[1],day:_.Tuesday,dayIndex:1,id:"lm-a-mm-dr-rec-weekly-Tuesday",label:"Tuesday"},{checked:!!this.iteration.weekDays[2],day:_.Wednesday,dayIndex:2,id:"lm-a-mm-dr-rec-weekly-Wednesday",label:"Wednesday"},{checked:!!this.iteration.weekDays[3],day:_.Thursday,dayIndex:3,id:"lm-a-mm-dr-rec-weekly-Thursday",label:"Thursday"},{checked:!!this.iteration.weekDays[4],day:_.Friday,dayIndex:4,id:"lm-a-mm-dr-rec-weekly-Friday",label:"Friday"},{checked:!!this.iteration.weekDays[5],day:_.Saturday,dayIndex:5,id:"lm-a-mm-dr-rec-weekly-Saturday",label:"Saturday"},{checked:!!this.iteration.weekDays[6],day:_.Sunday,dayIndex:6,id:"lm-a-mm-dr-rec-weekly-Sunday",label:"Sunday"}];this.dayCheckboxes=Ac(e,this.iteration.firstDayOfWeek)}},ns.ctorParameters=()=>[],ns.propDecorators={iteration:[{type:h}]},ns);Ga=d([p({selector:"lm-admin-memo-date-weekly",template:Cl})],Ga);function Ac(m,e){let t=m.findIndex(i=>i.day===e);return u.rotateLeft(m,t)}var Il=`<div class="field">\r
	<input\r
		type="radio"\r
		soho-radiobutton\r
		[(ngModel)]="iteration.frequencyType"\r
		id="lm-a-mm-dr-rec-yearly-abs"\r
		name="lm-a-mm-dr-rec-yearly-abs"\r
		[value]="FrequencyTypes.Absolute" />\r
	<label soho-label for="lm-a-mm-dr-rec-yearly-abs" [forRadioButton]="true">\r
		<div class="vertical-adjust">\r
			On\r
			<input\r
				type="number"\r
				lm-number-mask\r
				[onlyIntegers]="true"\r
				max="31"\r
				min="1"\r
				maxlength="2"\r
				class="lm-input-xxs"\r
				[(ngModel)]="iteration.dayOfMonth"\r
				[ngModelOptions]="{ updateOn: 'blur' }"\r
				(focus)="onFocus($event)" />\r
			<select\r
				soho-dropdown\r
				class="lm-dropdown-mds"\r
				name="lm-a-mm-dr-rec-yearly-abs-nth"\r
				[attributes]="{ name: 'id', value: 'lm-a-mm-dr-rec-yearly-abs-nth' }"\r
				noSearch\r
				[(ngModel)]="iteration.month">\r
				<option [value]="Months.January">January</option>\r
				<option [value]="Months.February">February</option>\r
				<option [value]="Months.March">March</option>\r
				<option [value]="Months.April">April</option>\r
				<option [value]="Months.May">May</option>\r
				<option [value]="Months.June">June</option>\r
				<option [value]="Months.July">July</option>\r
				<option [value]="Months.August">August</option>\r
				<option [value]="Months.September">September</option>\r
				<option [value]="Months.October">October</option>\r
				<option [value]="Months.November">November</option>\r
				<option [value]="Months.December">December</option>\r
			</select>\r
		</div>\r
	</label>\r
	<br />\r
	<input\r
		type="radio"\r
		soho-radiobutton\r
		[(ngModel)]="iteration.frequencyType"\r
		id="lm-a-mm-dr-rec-yearly-rel"\r
		name="lm-a-mm-dr-rec-yearly-rel"\r
		[value]="FrequencyTypes.Relative" />\r
	<label soho-label for="lm-a-mm-dr-rec-yearly-rel" [forRadioButton]="true">\r
		<div class="vertical-adjust">\r
			On the\r
			<select\r
				soho-dropdown\r
				class="lm-dropdown-mds"\r
				name="lm-a-mm-dr-rec-yearly-rel-nth"\r
				[attributes]="{ name: 'id', value: 'lm-a-mm-dr-rec-yearly-rel-nth' }"\r
				noSearch\r
				[(ngModel)]="iteration.weekOrdinal">\r
				<option [value]="WeekOrdinals.First">First</option>\r
				<option [value]="WeekOrdinals.Second">Second</option>\r
				<option [value]="WeekOrdinals.Third">Third</option>\r
				<option [value]="WeekOrdinals.Fourth">Fourth</option>\r
				<option [value]="WeekOrdinals.Last">Last</option>\r
			</select>\r
			<lm-admin-memo-weekday-select\r
				[(model)]="iteration.weekDay"></lm-admin-memo-weekday-select>\r
			of\r
			<select\r
				soho-dropdown\r
				class="lm-dropdown-mds"\r
				noSearch\r
				name="lm-a-mm-dr-rec-yearly-rel-month"\r
				[attributes]="{ name: 'id', value: 'lm-a-mm-dr-rec-yearly-rel-month' }"\r
				[(ngModel)]="iteration.month">\r
				<option [value]="Months.January">January</option>\r
				<option [value]="Months.February">February</option>\r
				<option [value]="Months.March">March</option>\r
				<option [value]="Months.April">April</option>\r
				<option [value]="Months.May">May</option>\r
				<option [value]="Months.June">June</option>\r
				<option [value]="Months.July">July</option>\r
				<option [value]="Months.August">August</option>\r
				<option [value]="Months.September">September</option>\r
				<option [value]="Months.October">October</option>\r
				<option [value]="Months.November">November</option>\r
				<option [value]="Months.December">December</option>\r
			</select>\r
		</div>\r
	</label>\r
</div>\r
<div class="field">\r
	<label soho-label>Duration</label>\r
	<p>\r
		Announcement is displayed\r
		<input\r
			type="number"\r
			lm-number-mask\r
			[onlyIntegers]="true"\r
			min="0"\r
			max="99"\r
			maxlength="2"\r
			class="lm-input-xxs"\r
			[(ngModel)]="iteration.daysBefore"\r
			[ngModelOptions]="{ updateOn: 'blur' }"\r
			(focus)="onFocus($event)" />\r
		day(s) before and\r
		<input\r
			type="number"\r
			lm-number-mask\r
			[onlyIntegers]="true"\r
			min="0"\r
			max="99"\r
			maxlength="2"\r
			class="lm-input-xxs"\r
			[(ngModel)]="iteration.daysAfter"\r
			[ngModelOptions]="{ updateOn: 'blur' }"\r
			(focus)="onFocus($event)" />\r
		day(s) after\r
	</p>\r
</div>\r
`;var rs,Va=(rs=class extends R{constructor(){super("MemoDateYearlyComponent"),this.Months=ee,this.FrequencyTypes=Xe,this.WeekOrdinals=Ae,this.WeekDays=_}onFocus(e){e.target.select()}},rs.ctorParameters=()=>[],rs.propDecorators={iteration:[{type:h}]},rs);Va=d([p({selector:"lm-admin-memo-date-yearly",template:Il})],Va);var wl=`<div\r
	id="lm-a-mm-dlg"\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[activated]="isBusy"\r
	[displayDelay]="0">\r
	<div soho-tab-list-container style="min-width: 630px; min-height: 570px">\r
		<div soho-tabs>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-mm-dlg-tab-bsc">Basic</a>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-mm-dlg-tab-dr">Recurrence</a>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-mm-dlg-tab-tr">Translations</a>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-mm-dlg-tab-per">Permissions</a>\r
				</li>\r
			</ul>\r
			<div soho-tab-panel-container>\r
				<div soho-tab-panel tabId="lm-a-mm-dlg-tab-bsc">\r
					<lm-admin-memo-basic [memo]="memo"></lm-admin-memo-basic>\r
				</div>\r
				<div soho-tab-panel tabId="lm-a-mm-dlg-tab-dr">\r
					<lm-admin-memo-date [memo]="memo"></lm-admin-memo-date>\r
				</div>\r
				<div soho-tab-panel tabId="lm-a-mm-dlg-tab-tr">\r
					<lm-translations-component\r
						[provider]="provider"\r
						[category]="entityCategory"\r
						[memoLayout]="memo.layout">\r
					</lm-translations-component>\r
				</div>\r
				<div soho-tab-panel tabId="lm-a-mm-dlg-tab-per">\r
					<lm-dynamic-permissions\r
						[listLabel]="permissionLabel"\r
						[selectedExpressions]="selectedExpressions"\r
						[showRecent]="false"\r
						[(selected)]="expressions"></lm-dynamic-permissions>\r
				</div>\r
			</div>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			id="lm-a-mm-dlg-cncl"\r
			type="button"\r
			class="btn-modal"\r
			[disabled]="isBusy"\r
			(click)="cancel()">\r
			Cancel\r
		</button>\r
		<button\r
			id="lm-a-mm-dlg-crt"\r
			type="button"\r
			class="btn-modal-primary no-validation"\r
			[disabled]="!canSave()"\r
			(click)="save()">\r
			Save\r
		</button>\r
	</div>\r
</div>\r
`;var _a,ls=(_a=class extends R{constructor(e,t,i){super("MemoAdminService",e,t),this.dataService=i}list(e){return this.dataService.post(this.getPath("list"),e).pipe(N(t=>this.toListResponse(t)))}create(e){return this.post(this.getPath("create"),e)}read(e){return this.post(this.getPath("read"),e)}update(e){return this.post(this.getPath("update"),e)}delete(e){return this.post(this.getPath("delete"),e)}export(e){let t="";if(e)for(let s of e)t+=(t.length===0?"?":"&")+"keys="+s;let i=this.dataService.getUrl("admin/memo/export/announcements.json")+t;window.open(i,"_blank")}post(e,t){return this.dataService.post(e,this.toRequest(t)).pipe(N(i=>this.toResponse(i)))}getPath(e){return"/admin/memo/"+e}toRequest(e){return{content:e.content.toData()}}toResponse(e){return new Wn(e.content)}toListResponse(e){let i=(e.content||[]).map(a=>new Ut(a)),s=new Wn(i);return s.paging=e.paging,s.accessTitles=e.accessTitles,s.maxCountAllowed=e.maxCountAllowed,s.memoCount=e.memoCount,s}},_a.ctorParameters=()=>[{type:b},{type:L},{type:St}],_a);ls=d([ye({providedIn:"root"})],ls);var ds,ri=(ds=class extends J{constructor(e,t){super("MemoDialogComponent",t),this.memoService=e,this.messageService=t,this.entityCategory=ne.memo,this.permissionLabel="Choose which set of users this announcement should be visible for.",this.provider=()=>this.getLocalizationParameter()}ngOnInit(){this.initModalDialog(),this.initExpressions(),this.initTranslations()}save(){if(!this.canSave())return;this.setCanClose(!1),this.setBusy(!0);let e=this.createRequest();(this.isEdit?this.memoService.update(e):this.memoService.create(e)).subscribe(i=>{this.closeWithResult(C.Ok,i)},i=>{this.showError(`Failed to ${this.isEdit?"update":"create"} announcement`,i.getErrorMessages()),this.canClose=!0,this.setBusy(!1)})}canSave(){if(this.isBusy)return!1;let e=this.basicComponent;return e?this.memo.validateMandatory(e.showActionButton):!0}getLocalizationParameter(){return this.updateTranslationOptions(),this.localizationParameter}initTranslations(){this.localizationParameter={translationOptions:this.createTranslationOptions(),localizationMap:this.memo.localization||{},enablePortation:!1}}updateTranslationOptions(){this.localizationParameter.translationOptions=this.createTranslationOptions()}createTranslationOptions(){let e=[{name:Ze.LocalizationKeyTitle,label:"Title",labelId:"lm-a-mm-tr-t-lbl",valueId:"lm-a-mm-tr-t",maxLength:Ze.MaxLengthTitle,defaultValue:this.memo.title,isRequired:!0},{name:Ze.LocalizationKeyText,label:"Content",labelId:"lm-a-mm-tr-tx-lbl",valueId:"lm-a-mm-tr-tx",maxLength:Ze.MaxLengthText,isMarkdown:!0,defaultValue:this.memo.text,isRequired:!ue.isNullOrWhitespace(this.memo.text)}];return this.basicComponent.showActionButton&&e.push({name:Ze.LocalizationKeyActionText,label:"Button title",labelId:"lm-a-mm-tr-at-lbl",valueId:"lm-a-mm-tr-at",maxLength:Ze.MaxLengthActionText,defaultValue:this.memo.actionText,isRequired:!0}),{items:e}}initExpressions(){this.memo.hasAccess&&(this.selectedExpressions=this.memo.accessIds.map(e=>({expressionId:e,title:this.accessTitles[e]||x.missingPolicyText})))}createRequest(){let e=this.memo,t=this.basicComponent,i=e.hasAccess,s=this.expressions,a=s&&s.length>0;return e.normalize(),t.showActionButton||(e.actionText=void 0,e.actionUrl=void 0),a?e.accessIds=s.map(o=>o.expressionId):i?e.accessIds=[]:e.accessIds=null,e.localization=this.localizationParameter.localizationMap,{content:e}}},ds.ctorParameters=()=>[{type:ls},{type:b}],ds.propDecorators={memo:[{type:h}],accessTitles:[{type:h}],basicComponent:[{type:f,args:[ni,{static:!0}]}]},ds);ri=d([p({template:wl})],ri);var Al=`<div\r
	#memoView\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div\r
		class="lm-admin-quota-message lm-margin-xl-b lm-pull-none"\r
		*ngIf="expressionFilter">\r
		<svg\r
			soho-icon\r
			icon="info"\r
			[alert]="true"\r
			id="lm-a-mm-policyfilter-icon"></svg>\r
		<p class="lm-pull-left" id="lm-a-mm-policyfilter-text">\r
			Showing announcements using security policy '{{ expressionFilterTitle }}'.\r
			<a\r
				soho-hyperlink\r
				name="lm-a-mm-clear-policyfilter"\r
				(click)="onClickClearPolicyFilter()"\r
				>Clear filter</a\r
			>.\r
		</p>\r
	</div>\r
\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-mm-maxtitle">\r
			<svg\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				soho-tooltip\r
				[title]="quotaTitle"\r
				*ngIf="isCloseToMaxQuota"\r
				id="lm-a-mm-maxicon"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" for="lm-a-mm-lst-search">Search</label>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="lm-a-mm-lst-search"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				id="lm-a-mm-1st-sort-button"\r
				menu="lm-a-mm-lst-sort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lm-a-mm-lst-sort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-mm-1st-sort' : 'item'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				id="lm-a-mm-1st-filter-button"\r
				menu="lm-a-mm-lst-filter"\r
				[disabled]="toolbarDisabled"\r
				class="btn-menu"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popupmenu id="lm-a-mm-lst-filter" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-mm-1st-filter' : 'item'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-mm-export"\r
				icon="export"\r
				[disabled]="!items.length"\r
				data-action="exportAll">\r
				Export All\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-mm-import"\r
				icon="import"\r
				data-action="import"\r
				*ngIf="!isReadOnly">\r
				Import\r
			</button>\r
			<div class="separator" *ngIf="!isReadOnly"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-mm-add"\r
				icon="add"\r
				data-action="add"\r
				*ngIf="!isReadOnly">\r
				New Announcement\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-mm-refresh"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<ul soho-popupmenu id="lm-a-m-pm">\r
		<li\r
			soho-popupmenu-item\r
			[isDisabled]="selectionCount !== 1 || !selected.hasAccess">\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-mm-menu-copy-permissions"\r
				(click)="copyPermissions()"\r
				>Copy Permissions</a\r
			>\r
		</li>\r
		<li soho-popupmenu-item [isDisabled]="!permissionsCopy">\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-mm-menu-apply-permissions"\r
				(click)="applyPermissions()"\r
				>Apply Copied Permissions ({{ selectionCount }})</a\r
			>\r
		</li>\r
		<li soho-popupmenu-item [isDisabled]="!permissionsCopy">\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-mm-menu-replace-permissions"\r
				(click)="replacePermissions()"\r
				>Replace Copied Permissions ({{ selectionCount }})</a\r
			>\r
		</li>\r
		<li\r
			soho-popupmenu-item\r
			[isDisabled]="selectionCount === 1 && !selected.hasAccess">\r
			<a\r
				soho-popupmenu-label\r
				id="lm-a-mm-menu-clear-permissions"\r
				(click)="clearPermissions()"\r
				>Clear Permissions ({{ selectionCount }})</a\r
			>\r
		</li>\r
	</ul>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<ng-container *ngFor="let action of actions">\r
				<button\r
					soho-button="tertiary"\r
					*ngIf="!action.separator && (!action.visible || action.visible())"\r
					icon="{{ action.icon }}"\r
					[disabled]="action.enabled && !action.enabled()"\r
					(click)="action.click()"\r
					[name]="action?.text() | lmAutoId: 'lm-a-mm-selected'">\r
					{{ action.text ? action.text() : "" }}\r
				</button>\r
				<div *ngIf="action.separator" class="separator"></div>\r
			</ng-container>\r
			<div class="separator" *ngIf="!isReadOnly"></div>\r
			<button\r
				soho-menu-button\r
				menu="lm-a-m-pm"\r
				type="button"\r
				id="lm-admin-m-permissions"\r
				*ngIf="!isReadOnly">\r
				<span>Permissions</span>\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div\r
		#memoDatagrid\r
		id="lm-a-mm-grid"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-mm-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a soho-hyperlink id="lm-a-mm-clear-filters" (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Pl=`:host ::ng-deep .datagrid-row-detail-padding .memo-content-row{display:flex;flex-direction:row;padding:0 0 30px 10px}:host ::ng-deep .datagrid-row-detail-padding .memo-content-column{display:flex;flex-direction:column;width:200px;padding:0 20px 0 0}:host ::ng-deep .datagrid-row-detail-padding .memo-textarea{display:flex;flex-direction:column;width:100%;padding:10px 0;overflow:hidden}:host ::ng-deep .datagrid-row-detail-padding .memo-title{font-size:1.8rem;padding:0 0 10px}:host ::ng-deep .datagrid-row-detail-padding img{max-width:115px;max-height:115px;margin:0 20px 0 0}:host ::ng-deep .datagrid-row-detail-padding .actionButton{padding-top:5px}:host ::ng-deep .separator{border-top:2px solid #e4e4e4;padding-top:10px;margin:0 10px}
/*# sourceMappingURL=list.css.map */
`;var Dl=`<div>\r
	<label id="lm-a-mm-pv-sa-lbl">Show as</label>\r
\r
	<fieldset class="radio-group">\r
		<input\r
			type="radio"\r
			class="radio"\r
			name="options"\r
			id="lm-a-mm-pv-tw"\r
			[(ngModel)]="mode"\r
			value="top"\r
			checked />\r
		<label id="lm-a-mm-pv-tw-lbl" for="lm-a-mm-pv-tw" class="radio-label"\r
			>Top bar widget</label\r
		>\r
		<br />\r
\r
		<ng-container *ngIf="isBannerFeature">\r
			<input\r
				type="radio"\r
				class="radio"\r
				name="options"\r
				id="lm-a-mm-pv-bw"\r
				[(ngModel)]="mode"\r
				value="banner" />\r
			<label id="lm-a-mm-pv-bw-lbl" for="lm-a-mm-pv-bw" class="radio-label"\r
				>Banner widget</label\r
			>\r
			<br />\r
		</ng-container>\r
\r
		<input\r
			type="radio"\r
			class="radio"\r
			name="options"\r
			id="lm-a-mm-pv-rw"\r
			[(ngModel)]="mode"\r
			value="regular" />\r
		<label id="lm-a-mm-pv-rw" for="lm-a-mm-pv-rw" class="radio-label"\r
			>Regular widget</label\r
		>\r
	</fieldset>\r
\r
	<div\r
		id="lm-a-mm-pv-sz"\r
		class="field"\r
		[hidden]="!showSize"\r
		lm-widget-size-display\r
		[size]="size"\r
		[maxSize]="maxSize"\r
		[includeSizeSelector]="true"\r
		selectionLabel="Sizing"\r
		(sizeChanged)="setSize($event)"></div>\r
\r
	<div class="field">\r
		<label id="lm-a-mm-pv-color-lbl" for="lm-a-mm-pv-color">Page Color</label>\r
		<input\r
			id="lm-a-mm-pv-color"\r
			soho-colorpicker\r
			name="color"\r
			[(ngModel)]="color"\r
			[attributes]="{ name: 'id', value: 'lm-a-mm-preview-color' }"\r
			[editable]="colorpickerOptions.editable"\r
			[showLabel]="colorpickerOptions.showLabel"\r
			[colors]="colorpickerOptions.colors"\r
			[clearable]="false" />\r
	</div>\r
</div>\r
`;var Za=class{constructor(e,t){this.storageService=e,this.isBannerFeature=t,this.key="MemoPreviewProviderSettings"}get settings(){let e=this.storageService.getLocalStorageItem(this.key)||this.getDefaultSettings();return!this.isBannerFeature&&e.mode==="banner"&&(e.mode="regular"),e}set settings(e){this.storageService.setLocalStorageItem(this.key,e)}getDefaultSettings(){return{mode:"top",color:I.defaultColor,size:{cols:1,rows:1}}}},cs,li=(cs=class extends R{constructor(e,t){super("MemoPreviewDialog"),this.colorpickerOptions=le.getPageColorPickerOptions(),this.maxSize=null,this.isBannerFeature=t.getContext().settings.isFeatureHeroWidget(),this.previewProvier=new Za(e,this.isBannerFeature)}ngOnInit(){this.settings=this.previewProvier.settings,this._color=this.settings.color,this.onModeChange()}save(){this.previewProvier.settings=this.settings}setSize(e){this.settings.size=e}get mode(){return this.settings.mode}set mode(e){this.settings.mode=e,this.onModeChange()}get showSize(){return this.settings.mode!=="top"}get size(){return this.settings.size}get color(){return this._color}set color(e){this._color=e,this.settings.color=this.colorpicker.getHexValue()}onModeChange(){if(this.validateMode(),this.mode==="banner"){let e=this.settings.size;e.rows>1&&(this.settings.size=this.sizeSelector.availableSizes.find(t=>t.rows===1&&t.cols===e.cols)),this.maxSize={cols:4,rows:1}}else this.maxSize=null}validateMode(){!this.isBannerFeature&&this.mode==="banner"&&(this.mode="regular")}},cs.ctorParameters=()=>[{type:lt},{type:ct}],cs.propDecorators={colorpicker:[{type:f,args:[Et,{static:!1}]}],sizeSelector:[{type:f,args:[Mr,{static:!1}]}]},cs);li=d([p({template:Dl})],li);var Ke,et,ja=(et=class extends q{set expressionFilter(e){if(!this.isValidExpressionFilter(e)){this.logInfo("Ignoring Expression filter change");return}e!=null&&this.logInfo("Expression filter set to "+e.expressionId),this._expressionFilter=e,e==null||!e.title?this.expressionFilterTitle=null:this.expressionFilterTitle=e.title,this.isInitialized&&this.clearAllFiltersOptional(!1)}get expressionFilter(){return this._expressionFilter}get previewColorNumber(){return le.hexCodeToNumber(this.previewSettings.color)}constructor(e,t,i,s,a,o,n,r,l,c,g,P,z,Z,me,De,se){super("AdminMemoListComponent","announcement",e,t,i,s,a,{sortPriority:!0,isFilter:!0,isUserFilter:!0,isOwnerFilter:!1,isRestrictionFilter:!1,filters:[{name:"Active",propertyName:"filter",value:1,type:H.Custom},{name:"Expired",propertyName:"filter",value:2,type:H.Custom},{name:"Future",propertyName:"filter",value:3,type:H.Custom},{name:"Recurring",propertyName:"filter",value:4,type:H.Custom},{name:"Critical",propertyName:"filter",value:5,type:H.Custom}]}),this.view=n,this.adminContext=r,this.memoService=l,this.memoRuntimeService=c,this.pageService=g,this.widgetService=P,this.containerService=z,this.progressService=Z,this.contextService=me,this.toastService=De,this.viewRef=se,this.expressionFilterTitle="",this.actions=[],this.maxQuotaMessage="You have reached your max allowed quota of announcements.",this._expressionFilter=null,this.isInitialized=!1,this.accessTitles={},this.isPreviewRestart=!1,this.previewProvider=new Za(o,me.getContext().settings.isFeatureHeroWidget()),this.datagridOptions=this.defaultOptions()}isValidExpressionFilter(e){return t(He.All)||t(He.Announcements);function t(i){return e&&e.filterTarget===i}}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId,this.isReadOnly=E.isReadOnlyUser(e)),this.actions=this.getActions(),this.refresh(),this.isInitialized=!0}add(){if(this.isMaxQuota){this.showError("Unable to add announcement",this.maxQuotaMessage);return}this.openDialog()}listItems(e){let t=this.createRequest(e);if(!t)return;this._expressionFilter!=null&&(t.expressionId=this._expressionFilter.expressionId);let i=this.memoService.list(t);this.withBusy(i).subscribe(s=>{this.addItems(s.content,s.paging),this.addTitles(s.accessTitles),this.updateCount(s.memoCount,s.maxCountAllowed)},s=>{this.adminService.handleError(s)})}onExpandRow(e){let t=$(e.detail).find(".datagrid-row-detail-padding").empty(),i=e.item;if(!i)return;let s=oe.escapeStringForHtml,a=!!i.actionUrl,o=!!i.imageUrl,n=i.priorityText,r='<div class="memo-content-row">';o&&(r+=`<img src="${s(i.imageUrl)}">`),r+=`<div class="memo-textarea">
							<span class="memo-title lm-truncate-text">${s(i.title)}</span>`,i.text&&(r+=`<span class="lm-white-space-normal">${s(i.text)}</span>`),a&&(r+=`<a target="_blank" [name]="memoItem.title | lmAutoId : 'lm-a-mm-list-link'" class="lm-margin-lg-t actionButton hyperlink">${s(i.actionText)}</a>`),r+=`</div>
				</div>
				<div class="separator"></div>
				<div class="memo-content-row">
					<div class="memo-content-column">
						<span class="label">Available from</span>
						<p>${de.parseToString(i.startDate)}</p>
					</div>
					<div class="memo-content-column">
						<span class="label">Available to</span>
						<p>${de.parseToString(i.endDate)}</p>
					</div>
					<div class="memo-content-column">
						<span class="label">Time zone</span>
						<p>${i.timeZone}</p>
					</div>
					<div class="memo-content-column">
						<span class="label">Recurring</span>`,i.iteration.frequency!==ce.None?r+="<p>Yes</p>":r+="<p>No</p>",r+="</div>",r+=`<div class="memo-content-column">
						<span class="label">Applies to</span>
						<div style="display: flex;">${this.formatAppliesTo(i)}</div>
					</div>
					<div class="memo-content-column">
						<span class="label">Priority</span>
						<p>${n}</p>
					</div>
				</div>
		`;let l=$(r),c=l.find("a");c&&c.click(g=>{g.preventDefault(),this.contextService.getContext().launch({url:i.actionUrl,resolve:!0})}),$(t).append(l)}onClickClearPolicyFilter(){this.clearExpressionFilter(),this.clearAllFilters()}clearExpressionFilter(){this._expressionFilter=null}copyPermissions(){let e=this.getSelectedItem();this.permissionsCopy=[...e.accessIds],this.toastService.show({title:"Copy",message:`Permissions for "${e.title}" were copied`,position:Ie.BOTTOM_RIGHT,timeout:2e3})}applyPermissions(){let e=t=>{if(t.hasAccess)for(let i of this.permissionsCopy)t.accessIds.includes(i)||t.accessIds.push(i);else t.accessIds=this.permissionsCopy;return t};this.updatePermissions(e,Ke.operationApply)}replacePermissions(){let e=t=>(t.accessIds=this.permissionsCopy,t);this.updatePermissions(e,Ke.operationReplace)}clearPermissions(){let e=t=>(t.hasAccess&&(t.accessIds=[]),t);this.updatePermissions(e,Ke.operationClear)}exportSelected(){let e=this.getSelectedItems().map(t=>t.memoId);e.length!==0&&this.memoService.export(e)}exportAll(){this.memoService.export()}import(){if(this.isImportOpen)return;this.isImportOpen=!0;let e={operation:ne.memo.toString(),title:"Import Announcements",acceptFileExtension:".json",showStrategySelector:!0};this.adminService.openImportDialog(e,this.view,()=>{this.accessTitles={},this.refresh()}).subscribe(()=>{this.isImportOpen=!1},()=>{this.isImportOpen=!1})}getDataGrid(){return this.dataGrid}getActions(){return[{text:()=>"Edit",icon:"edit",enabled:()=>this.selectionCount===1,visible:()=>!this.isReadOnly,click:()=>this.onEdit()},{text:()=>`Delete (${this.selectionCount})`,icon:"delete",enabled:()=>this.selectionCount>=1,visible:()=>!this.isReadOnly,click:()=>this.confirmDelete()},{text:()=>`Export (${this.selectionCount})`,icon:"export",enabled:()=>this.selectionCount>=1,click:()=>this.exportSelected()},{separator:!0},{text:()=>"Preview",icon:"search-list",enabled:()=>this.selectionCount===1,click:()=>this.onPreview()}]}getColumns(){return[{width:50,id:"selectionCheckbox",field:"",name:"",sortable:!1,resizable:!1,formatter:Formatters.SelectionCheckbox,align:"center"},{width:77,id:"lm-a-mm-col-sts",field:"sts",name:"Status",resizable:!0,sortable:!1,formatter:(e,t,i,s,a,o)=>{let n=a;return Xt.format(this.getMemoStatusOptions(n))}},{width:107,id:"lm-a-mm-col-ists",field:"",name:"Recurrence",resizable:!0,sortable:!1,formatter:(e,t,i,s,a,o)=>{let n=a;return Xt.format(this.getIterationStatusOptions(n))}},{width:325,id:"lm-a-mm-col-t",field:"title",name:"Title",resizable:!0,sortable:!1,formatter:Formatters.Expander,textOverflow:"ellipsis"},{width:250,id:"lm-a-mm-col-cbn",field:"changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName},{width:160,id:"lm-a-mm-col-cd",field:"changeDate",name:"Change date",resizable:!0,sortable:!1,formatter:S.date},{width:320,id:"lm-a-mm-col-at",field:"",name:"Applies to",resizable:!0,sortable:!1,formatter:(e,t,i,s,a,o)=>this.formatAppliesTo(a)}]}getEmptyMessage(){return"No announcements found"}clearCustomFilter(){this.clearExpressionFilter()}updatePermissions(e,t){let i=this.getPreMultiOperationErrorMessage(t);if(i){this.showMessage(this.getMessageTitle(t),i+" The selection is invalid, please make a new selection.");return}let a=this.getSelectedItems().map(r=>e(Ut.copy(r))).map(r=>this.memoService.update({content:r})),o=this.sohoDialogService.modal(Ct,this.view).title(`${t} Permissions`).id("lm-a-mm-op-dialog").afterClose(()=>{this.ngZone.run(()=>{this.refresh()})}),n={customSuccessfulMessage:r=>`Updated permissions for ${r} ${E.pluralize("announcement",r)}.`,customFailedMessage:r=>`Failed to update permissions for ${r} ${E.pluralize("announcement",r)}.`,entityname:"announcement",operationName:"update",operations:a};o.apply(r=>{r.modalDialog=o,r.options=n}).open()}getMessageTitle(e){return e===Ke.operationApply?"Unable to Apply Security Policies":e===Ke.operationClear?"Unable to Clear Security Policies":e===Ke.operationReplace?"Unable to Replace Security Policies":"Unable to Save"}getPreMultiOperationErrorMessage(e){let t=this.getSelectedItems(),i="",s=[],a=[];if(t&&t.length>0){t.forEach(r=>{r.dateRangeStatus===Qe.Expired&&s.push(r.title),e===Ke.operationApply&&r.accessIds&&r.accessIds.length>0&&this.getMergedCount(this.permissionsCopy,r.accessIds)>I.MaxPolicies&&a.push(r.title)});let o=s.length;o>0&&(i=o===1?"The announcement '"+s[0]+"' has expired and cannot be updated.":" There are "+o+" expired announcements which cannot be updated.");let n=a.length;if(n>0){let r=n===1?"More than "+I.MaxPolicies+" security policies are not allowed for the announcement '"+a[0]+"'.":"There are "+n+" announcements that would get more than "+I.MaxPolicies+" security policies, which is not allowed.";i&&(i=i+" "),i=i+r}return i}else return null}getMergedCount(e,t){return!t||t.length===0?e?e.length:0:(!e||e.length===0||e.forEach(i=>{t.includes(i)||t.push(i)}),t.length)}onEdit(){this.openDialog(this.getSelectedItem())}confirmDelete(){let e=E.pluralize("Announcement",this.selectionCount),t=`Delete ${e}`,i=`Are you sure that you want to delete the selected ${e.toLowerCase()}?`;this.showConfirm(t,i).subscribe(()=>{this.selectionCount===1?this.deleteSelected():this.deleteMultiSelected()})}deleteSelected(){let e={content:this.getSelectedItem()};this.setBusy(!0),this.memoService.delete(e).subscribe(()=>{this.setBusy(!1),this.refresh()},()=>{this.setBusy(!1)})}deleteMultiSelected(){let e=this.getSelectedItems();if(e){let t=[];for(let a of e){let o={content:a},n=this.memoService.delete(o);t.push(n)}let i=this.sohoDialogService.modal(Ct,this.view).title("Delete Announcements").id("lm-a-mm-op-dialog").afterClose(()=>{this.refresh()}),s={customSuccessfulMessage:a=>`Deleted ${a} ${E.pluralize("announcement",a)}.`,customFailedMessage:a=>`Failed to delete ${a} ${E.pluralize("announcement",a)}.`,entityname:"announcement",operationName:"delete",operations:t};i.apply(a=>{a.modalDialog=i,a.options=s}).open()}}openDialog(e){if(this.isEditOpen)return;this.isEditOpen=!0;let t=!!e;t&&e.normalize();let i=t?"Edit Announcement":"New Announcement",s=this.sohoDialogService.modal(ri,this.viewRef).title(i).id("lm-a-mm-announcement-dialog").afterClose(a=>{this.isEditOpen=!1,a&&a.value&&this.refresh()});s.apply(a=>{a.modalDialog=s,a.isEdit=t,a.memo=e?Ut.copy(e):new Ut,a.accessTitles=this.accessTitles}).open()}addTitles(e){e&&Object.assign(this.accessTitles,e)}onPreview(){this.progressService.setBusy(!0),this.widgetService.getDefinition({id:Ke.memoWidgetId}).subscribe(()=>{this.progressService.setBusy(!1),this.preStartPreview()},()=>{this.progressService.setBusy(!1),this.preStartPreview()})}preStartPreview(){this.progressService.onNextNotBusy(()=>this.containerService.hideAdmin(T.Announcements,!1)),this.startMemoPreview()}startMemoPreview(){this.previewSettings=this.previewProvider.settings,this.closePreviewSubject=new gt(1);let t=[this.getSelectedItem().toData()];this.memoRuntimeService.startPreview({mode:this.previewSettings.mode,items:t}),this.pageService.previewPage(this.createPreviewOptions())}createPreviewOptions(){let e=W.random(),t=[{text:"Preview Settings",icon:"settings",hasSeparator:!1,execute:()=>{this.showPreviewSettings()}}];return this.isReadOnly||t.push({text:"Edit",icon:"edit",hasSeparator:!1,execute:()=>{this.notifyClosePreview(),this.onEdit()}}),{title:"Previewing Announcement",pageId:e,isDuplicatable:!1,isAddable:!1,notifyMingle:!1,actions:t,onClose:()=>{this.memoRuntimeService.stopPreview(),this.isPreviewRestart?(this.isPreviewRestart=!1,setTimeout(()=>{this.ngZone.run(()=>{this.startMemoPreview()})},500)):this.containerService.showAdmin()},close$:this.closePreviewSubject.asObservable(),page:this.createPreview(e)}}showPreviewSettings(){let e=this.sohoDialogService.modal(li,this.view).title("Preview Settings").id("lm-a-mm-psettings-dialog").buttons([{text:"Cancel",id:"lm-a-mm-psettings-dialog-cancel",click:()=>e.close()},{text:"Save",isDefault:!0,id:"lm-a-mm-psettings-dialog-save",click:()=>{e.componentDialog.save(),e.close(),this.isPreviewRestart=!0,this.notifyClosePreview()}}]).apply(t=>{t.settings=this.previewProvider.settings}).open()}notifyClosePreview(){this.closePreviewSubject.next({}),this.closePreviewSubject.complete()}createPreview(e){let t=[],i=this.previewSettings;if(i.mode!=="top"){let s=i.size;t.push({id:Ke.memoWidgetId,instanceId:W.random(),isBanner:i.mode==="banner",layout:{column:0,columnSpan:s.cols,row:0,rowSpan:s.rows}})}return{data:{id:e,color:this.previewColorNumber,config:{enableMemo:i.mode==="top"?1:0},content:{widgets:t}},isEditable:!1,isViewable:!0}}formatAppliesTo(e){let t=x.getAppliesTo(e.accessIds,this.accessTitles),i=oe.escapeStringForHtml(t.tooltip||t.cellText),s=oe.escapeStringForHtml(t.cellText);return`
			<div class="lm-truncate-text">
				<svg class="icon datagrid-alert-icon ${t.iconClass}"
					focusable="false" aria-hidden="true" role="presentation">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${t.icon}"/>
				</svg>
				<p style="display:inline; margin-left: 5px;"
					title='${i}'>
					${s}
				</p>
			</div>
			`}getMemoStatusOptions(e){return{status:e.dateRangeStatus,isFutureMessage:"Announcement is not yet active",isActiveCloseExpireMessage:"Announcement expires soon",isActiveMessage:"Announcement is active",isExpiredMessage:"Announcement has expired"}}getIterationStatusOptions(e){return{status:e.iterationStatus,iconName:Ke.iterationIcon,isFutureMessage:"Recurring, not currently active",isActiveMessage:"Recurring and active",isExpiredMessage:"Recurring, not currently active"}}},Ke=et,et.iterationIcon="search-results-history",et.memoWidgetId="infor.mingle.memos",et.operationApply="Apply",et.operationClear="Clear",et.operationReplace="Replace",et.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:lt},{type:A},{type:O},{type:ls},{type:Ur},{type:Rt},{type:at},{type:Fe},{type:dt},{type:ct},{type:Ie},{type:A}],et.propDecorators={expressionFilter:[{type:h}],dataGrid:[{type:f,args:["memoDatagrid",{static:!1}]}]},et);ja=Ke=d([p({selector:"lm-admin-memos",template:Al,styles:[Pl]})],ja);var El=`<select\r
	soho-dropdown\r
	class="lm-dropdown-mds"\r
	noSearch\r
	[ngModel]="model"\r
	(ngModelChange)="modelChange.emit($event)"\r
	name="lm-a-mm-dr-weekday"\r
	[attributes]="{ name: 'id', value: 'lm-a-mm-dr-weekday' }">\r
	<option *ngFor="let day of weekdays" [value]="day.value">\r
		{{ day.label }}\r
	</option>\r
</select>\r
`;var $a,Ya=($a=class{constructor(){this.modelChange=new V,this.weekdays=Rc()}},$a.propDecorators={model:[{type:h}],modelChange:[{type:U}]},$a);Ya=d([p({selector:"lm-admin-memo-weekday-select",template:El})],Ya);function Rc(){let m=[{value:_.Sunday,label:"Sunday"},{value:_.Monday,label:"Monday"},{value:_.Tuesday,label:"Tuesday"},{value:_.Wednesday,label:"Wednesday"},{value:_.Thursday,label:"Thursday"},{value:_.Friday,label:"Friday"},{value:_.Saturday,label:"Saturday"}];return u.rotateLeft(m,Mc())}function Mc(){return Soho.Locale.calendar().firstDayofWeek||0}var Tl=`<p class="lm-margin-xl-b">\r
	You are adding an archived version of the page '{{ entityTitle }}'. Add a\r
	comment to easier identify this version.\r
</p>\r
<div class="field">\r
	<label for="lm-a-arc-crt-cmt" class="required">Comment</label>\r
	<textarea\r
		soho-textarea\r
		id="lm-a-arc-crt-cmt"\r
		type="text"\r
		maxlength="256"\r
		[(ngModel)]="comment"\r
		data-validate="required"\r
		required></textarea>\r
</div>\r
<div class="modal-buttonset">\r
	<button\r
		id="lm-a-arc-crt-cncl"\r
		type="button"\r
		class="btn-modal"\r
		(click)="close()">\r
		Cancel\r
	</button>\r
	<button\r
		id="lm-a-arc-crt-ok"\r
		type="button"\r
		class="btn-modal-primary"\r
		(click)="createArchive()">\r
		OK\r
	</button>\r
</div>\r
`;var Ha,ms=(Ha=class extends J{constructor(e,t,i,s){super("ArchiveCreateDialog",i,s),this.adminService=e,this.dialogService=t}ngOnInit(){this.initModalDialog()}createArchive(){let e={entityId:this.entityId,comment:this.comment};this.isCreated&&!this.hasSubmitError||(this.isCreated=!0,this.submitSafe(this.adminService.createArchive(e,this.baseUrl),!0).pipe(G(t=>(this.showError("Archive",`Unable to add the page to the archive. ${t.getErrorMessages()}`),Y())),re(()=>{this.dialogService.showToast({title:"Archive created",message:`Page '${this.entityTitle}' has been archived.`}),this.adminService.raiseArchiveCreated()})).subscribe())}},Ha.ctorParameters=()=>[{type:y},{type:$e},{type:b},{type:L}],Ha);ms=d([p({template:Tl})],ms);var kl=`<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-arc-maxtitle">\r
			<svg\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				soho-tooltip\r
				[title]="quotaTitle"\r
				*ngIf="isCloseToMaxQuota"\r
				id="lm-a-arc-maxicon"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="lm-a-arc-search"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				menu="lm-a-arc-sort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lm-a-arc-sort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-arc-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				menu="lm-a-arc-flt"\r
				[disabled]="toolbarDisabled"\r
				class="btn-menu"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popupmenu id="lm-a-arc-flt" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-arc-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-arc-rfr"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<ng-container *ngIf="!isReadOnly">\r
				<button\r
					soho-button="tertiary"\r
					id="lm-a-arc-dlt"\r
					icon="delete"\r
					(click)="onClickDelete(selected)">\r
					Delete\r
				</button>\r
				<div class="separator"></div>\r
				<button\r
					soho-button="tertiary"\r
					id="lm-a-arc-rst"\r
					icon="reset"\r
					(click)="onClickRestore(selected)">\r
					Restore\r
				</button>\r
			</ng-container>\r
		</div>\r
	</div>\r
	<div\r
		soho-datagrid\r
		#archiveDatagrid\r
		id="lm-a-arc-grid"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-arc-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a\r
					soho-hyperlink\r
					id="lm-a-arc-clear-filters"\r
					(click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button="secondary"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Ol=`<div\r
	#restoreTemplateRef\r
	class="lm-margin-md-b"\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="300">\r
	<p class="lm-margin-lg-b">Choose how you want to restore the archive.</p>\r
	<ng-container>\r
		<fieldset class="radio-group lm-margin-zero-b">\r
			<ng-container *ngIf="originalEntity">\r
				<input\r
					soho-radiobutton\r
					type="radio"\r
					id="lm-a-arc-res-org"\r
					name="arc-restore"\r
					[(ngModel)]="restoreStrategy"\r
					[value]="0"\r
					[attr.disabled]="isRestoreToDisabled ? '' : null" />\r
				<label soho-label for="lm-a-arc-res-org" [forRadioButton]="true"\r
					>Restore to '{{ originalTitle }}'</label\r
				>\r
				<br />\r
			</ng-container>\r
			<input\r
				soho-radiobutton\r
				type="radio"\r
				id="lm-a-arc-res-new"\r
				name="arc-restore"\r
				[(ngModel)]="restoreStrategy"\r
				[value]="1" />\r
			<label soho-label for="lm-a-arc-res-new" [forRadioButton]="true"\r
				>Restore as new page</label\r
			>\r
			<br />\r
			<input\r
				soho-radiobutton\r
				type="radio"\r
				id="lm-a-arc-res-other"\r
				name="arc-restore"\r
				[(ngModel)]="restoreStrategy"\r
				[value]="2" />\r
			<label soho-label for="lm-a-arc-res-other" [forRadioButton]="true"\r
				>Restore to another page</label\r
			>\r
			<button\r
				id="lm-a-arc-res-sel"\r
				soho-button="tertiary"\r
				icon="search"\r
				[disabled]="restoreStrategy !== 2"\r
				(click)="openArchiveSelect()">\r
				Select page\r
			</button>\r
		</fieldset>\r
	</ng-container>\r
	<div class="modal-buttonset">\r
		<button id="lm-a-arc-res-cncl" class="btn-modal" (click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			id="lm-a-arc-res-rest"\r
			class="btn-modal-primary"\r
			[disabled]="restoreStrategy === 2 && !lookupEntity"\r
			(click)="showConfirmRestore()">\r
			Restore\r
		</button>\r
	</div>\r
</div>\r
`;var Rl=`<div>\r
	<lm-operation-messages\r
		[statusMessageList]="statusMessageList"\r
		[errorMessageList]="errorMessageList"\r
		[isCompleted]="!isImporting">\r
	</lm-operation-messages>\r
	<button\r
		class="btn-secondary lm-margin-md-t"\r
		[disabled]="isCancelled || !isImporting"\r
		(click)="cancel()"\r
		id="lm-a-dp-op-result-dialog-cancel">\r
		Cancel {{ this.operation }}\r
	</button>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal"\r
			(click)="close()"\r
			[disabled]="isImporting"\r
			id="lm-a-dp-op-result-dialog-close">\r
			Close\r
		</button>\r
	</div>\r
</div>\r
`;var qa,Ft=(qa=class extends J{constructor(e,t){super("DynamicPageImportDialog"),this.dynamicPageAdminService=e,this.adminService=t,this.pageIdMap={},this.isImporting=!1,this.isCancelled=!1,this.clearMessages()}ngOnInit(){this.pageId!=null&&(this.pageIdMap[M.entityIdKey]=this.pageId),this.initModalDialog(),this.importData()}cancel(){this.isCancelled||(this.isCancelled=!0,this.dynamicPageAdminService.cancelOperation().subscribe(e=>{},e=>{this.isImporting=!1,this.adminService.showUploadCompleteDialog("Error",e.toErrorLog(),!0)}))}close(){this.setCanClose(!0),this.modalDialog.close(this.errorMessageList.length===0)}clearMessages(){this.statusMessageList=[],this.errorMessageList=[]}checkStatus(e){let t=this;t.dynamicPageAdminService.getOperationStatus().subscribe(i=>{let s=i.content;s&&s.messageList&&(t.statusMessageList=s.messageList),s&&s.isRunning?(this.isCancelled=!1,setTimeout(()=>t.checkStatus(e),M.checkStatusInterval)):(t.isImporting=!1,e&&e())},i=>{let s=i.content;s&&s.messageList&&(t.statusMessageList=s.messageList),i.errorList&&(t.errorMessageList=i.errorList),s.isRunning?setTimeout(()=>t.checkStatus(e),M.checkStatusInterval):(t.isImporting=!1,e&&e())})}importData(){let e=this;e.isImporting=!0,this.submitSafe(e.dynamicPageAdminService.startImportOperation(e.pageIdMap),!0,!0).subscribe(t=>{let i=t.content;i.isRunning?(i.messageList&&(e.statusMessageList=i.messageList),e.checkStatus()):e.isImporting=!1},t=>{e.isImporting=!1,e.adminService.showUploadCompleteDialog("Import Error",t.toErrorLog(),!0)})}},qa.ctorParameters=()=>[{type:F},{type:y}],qa);Ft=d([p({template:Rl})],Ft);var Ml=`<div class="row lm-margin-xl-t">\r
	<div class="twelve columns">\r
		<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
			<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
			</soho-toolbar-flex-section>\r
\r
			<soho-toolbar-flex-section [isSearch]="true">\r
				<input\r
					soho-toolbar-flex-searchfield\r
					[clearable]="true"\r
					[collapsible]="true"\r
					maxlength="64"\r
					[(ngModel)]="query"\r
					[disabled]="toolbarDisabled"\r
					(cleared)="clearSearch()"\r
					(lm-submit)="search()"\r
					(keydown.esc)="clearSearch()"\r
					id="lm-a-arc-sel-search"\r
					(focus)="onSearchfieldFocus()"\r
					(blur)="onSearchfieldFocusLost()" />\r
			</soho-toolbar-flex-section>\r
\r
			<soho-toolbar-flex-section [isButtonSet]="true">\r
				<!-- Sort -->\r
				<button\r
					soho-menu-button\r
					menu="lm-a-arc-sel-sort"\r
					[disabled]="toolbarDisabled"\r
					type="button"\r
					icon="sort-down">\r
					{{ orderBy.name }}\r
				</button>\r
				<ul soho-popupmenu id="lm-a-arc-sel-sort">\r
					<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
						<a\r
							soho-popupmenu-label\r
							[name]="item.name | lmAutoId: 'lm-a-arc-sel-sortorder'"\r
							(click)="setOrderBy(item)"\r
							>{{ item.name }}</a\r
						>\r
					</li>\r
				</ul>\r
				<button\r
					soho-menu-button\r
					menu="lm-a-arc-sel-flt"\r
					[disabled]="toolbarDisabled"\r
					class="btn-menu"\r
					type="button"\r
					icon="filter"\r
					soho-tooltip\r
					[title]="filterTooltip">\r
					<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
					Filter\r
				</button>\r
				<ul soho-popupmenu id="lm-a-arc-sel-flt" class="is-selectable">\r
					<li\r
						soho-popupmenu-item\r
						*ngFor="let item of filterItems"\r
						[isChecked]="item.selected">\r
						<a\r
							soho-popupmenu-label\r
							[name]="item.name | lmAutoId: 'lm-a-arc-sel-filteroption'"\r
							(click)="onFilter(item)"\r
							>{{ item.name }}</a\r
						>\r
					</li>\r
				</ul>\r
				<button\r
					id="lm-a-arc-sel-ref"\r
					soho-button="icon"\r
					icon="refresh"\r
					data-action="refresh"\r
					style="border: 0; margin-bottom: 0"\r
					soho-tooltip\r
					title="Refresh">\r
					<span class="audible">Refresh</span>\r
				</button>\r
			</soho-toolbar-flex-section>\r
\r
			<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
		</soho-toolbar-flex>\r
\r
		<div class="contextual-toolbar toolbar is-hidden">\r
			<div class="title">{{ getTitle() }}</div>\r
			<div class="buttonset">\r
				<button\r
					id="lm-a-arc-sel-cho"\r
					soho-button="tertiary"\r
					icon="download"\r
					(click)="checkOutPage(selected)"\r
					*ngIf="archiveType === 1 && selected?.lock !== 1">\r
					Check out\r
				</button>\r
			</div>\r
		</div>\r
		<div\r
			soho-datagrid\r
			#entityDatagrid\r
			id="lm-a-arc-sel-grid"\r
			[gridOptions]="datagridOptions"\r
			[data]="datagridOptions.dataset"\r
			(selected)="updateSelection($event.rows)"></div>\r
		<div class="lm-pull-left lm-margin-md-t">\r
			<p *ngIf="!toolbarDisabled">\r
				{{ getItemCountText() }}\r
				<span *ngIf="isSearchActive || filter.type"\r
					>There are active filters.\r
					<a id="lm-a-arc-sel-clr" soho-hyperlink (click)="clearAllFilters()"\r
						>Clear all</a\r
					>\r
				</span>\r
			</p>\r
		</div>\r
		<button\r
			id="lm-a-more-btn"\r
			soho-button="secondary"\r
			(click)="more()"\r
			[disabled]="!hasMore">\r
			More\r
		</button>\r
	</div>\r
</div>\r
<div class="modal-buttonset">\r
	<button id="lm-a-arc-sel-cncl" class="btn-modal" (click)="dialog?.close()">\r
		Cancel\r
	</button>\r
	<button\r
		id="lm-a-arc-sel-ok"\r
		class="btn-modal-primary"\r
		[disabled]="!selected || !selected?.lockedByUser"\r
		(click)="closeWithSelected(selected)">\r
		OK\r
	</button>\r
</div>\r
`;var hs,ps=(hs=class extends q{constructor(e,t,i,s,a,o,n,r){super("ArchiveSelectorDialog","page",e,t,i,s,a,{isFilter:!0,isOwnerFilter:!1,isOtherUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Checked out",propertyName:"lock",value:1,type:H.Custom},{name:"Draft",propertyName:"state",value:Me.Draft,type:H.Custom},{name:"Published",propertyName:"state",value:Me.Published,type:H.Custom},{name:"Published (Edited)",propertyName:"state",value:Me.PublishedEdited,type:H.Custom}]}),this.dynamicPageService=o,this.adminContext=n,this.dialogService=r}getDataGrid(){return this.dataGrid}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId),this.initGrid(),this.refresh()}closeWithSelected(e){this.dialog.close(e)}listItems(e){switch(this.archiveType){case Ei.DynamicPage:this.listDynamicPages(e);break;default:this.logDebug(`listItems: Unknown archive type: ${this.archiveType}`);break}}listDynamicPages(e){let t=this.createRequest(e);if(!t)return;let i=this.dynamicPageService.listPages(t);this.withBusy(i).subscribe(s=>{this.addItems(s.content,s.paging)},s=>{this.onError(s)})}getTitle(){switch(this.archiveType){case Ei.DynamicPage:return this.getTitleDynamicPage();default:return this.logDebug(`getTitle: Unknown archive type: ${this.archiveType}`),""}}checkOutPage(e){this.logDebug(`Checking out page ${e.pageId}`);let t="Check out",i=this.dynamicPageService.checkOutPage(e.pageId);this.withBusy(i).subscribe(s=>{this.updateSelected(s.content),this.showToast(t,`'${e.title}' was checked out.`)},()=>{this.showError(t,"Unable to check out page.")})}getColumns(){return[this.getSelectionColumn(),{width:205,id:"lm-a-arc-sel-col-t",field:"title",name:"Title",sortable:!1,resizable:!0},{width:304,id:"lm-a-arc-sel-col-d",field:"description",name:"Description",sortable:!1,resizable:!0},{width:200,id:"lm-a-arc-sel-col-cd",field:"changeDate",name:"Change date",sortable:!1,resizable:!0,formatter:S.date},{width:173,id:"lm-a-arc-sel-col-cbn",field:"changedByName",name:"Changed by",sortable:!1,resizable:!0,formatter:S.displayName},{width:173,id:"lm-a-arc-sel-col-lbn",field:"",name:"Checked out by",sortable:!1,resizable:!0,formatter:(e,t,i,s)=>{let a=this.items[e];return a&&a.lock===1?S.displayName(null,null,a.changedByName,null):""}},{width:140,id:"lm-a-arc-sel-col-s",field:"state",name:"Status",sortable:!1,resizable:!0,formatter:S.dynamicPageStatus}]}getEmptyMessage(){return"No dynamic pages found"}initGrid(){switch(this.archiveType){case Ei.DynamicPage:this.initDynamicPagesGrid();break;default:this.logDebug(`initGrid: Unknown archive type: ${this.archiveType}`);break}}getTitleDynamicPage(){let e=this.selected;return e&&e.lock===1&&!e.lockedByUser?"This page has been checked out by another user":e&&e.lock!==1?"You need to check out the page before you can restore the archive":e&&e.lockedByUser?"Press OK to restore the archive on this page":""}showToast(e,t){this.dialogService.showToast({title:e,message:t})}updateSelected(e){let t=u.indexByProperty(this.items,"pageId",e.pageId);t<0||(this.items[t]=e,this.dataGrid.updateRow(t,e),this.selectItem(e))}initDynamicPagesGrid(){let e=this.defaultOptions();e.selectable="single",e.rowHeight="medium",e.expandableRow=!1,this.datagridOptions=e}},hs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:F},{type:O},{type:$e}],hs.propDecorators={dataGrid:[{type:f,args:["entityDatagrid",{static:!1}]}]},hs);ps=d([p({template:Ml})],ps);var us,zt=(us=class extends J{constructor(e,t,i,s){super("ArchiveRestoreDialog",i,s),this.dynamicPageService=e,this.sohoModalDialogService=t,this.title="Restore archive"}ngOnInit(){this.initModalDialog(),this.checkArchivedFrom()}openArchiveSelect(){let e=this.sohoModalDialogService.modal(ps,this.restoreTemplateRef).title("Restore Dynamic Page").id("lm-a-arc-rst-selectpage-dialog").afterClose(t=>{this.lookupEntity=t});e.apply(t=>{t.title="Select a dynamic page",t.dialog=e,t.archiveType=this.archiveType}).open()}showConfirmRestore(){let e=this.restoreStrategy;e===mt.Original?this.confirmRestoreOriginal():e===mt.OtherPage?this.confirmRestoreOther():this.startRestoreOperation()}confirmRestoreOriginal(){let e=this.originalEntity,t;if(e.lock===1&&!e.lockedByUser){t=`The page '${e.title}' can not be overwritten as it is checked out by another user.`,this.showError(this.title,t);return}if(e.lockedByUser){t=`This restore will replace '${e.title}'. Are you sure you want to continue?`,this.showConfirm(this.title,t).subscribe(()=>{this.startRestoreOperation()});return}t=`This restore will replace '${e.title}'. Are you sure you want to continue?`,this.showConfirm(this.title,t).subscribe(()=>{this.dynamicPageService.checkOutPage(e.pageId).subscribe(()=>{this.startRestoreOperation()},()=>{this.logDebug("Unable to check out page before restore")})})}confirmRestoreOther(){let e=`This restore will replace ${this.lookupEntity.title}. Are you sure you want to continue?`;this.showConfirm(this.title,e).subscribe(()=>{this.startRestoreOperation()})}startRestoreOperation(){this.logDebug("Starting restore operation");let e={};e[M.archiveIdKey]=this.archiveId,this.restoreStrategy===mt.Original?e[M.entityIdKey]=this.originalEntity.pageId:this.restoreStrategy===mt.OtherPage&&(e[M.entityIdKey]=this.lookupEntity.pageId);let t=this.sohoModalDialogService.modal(Ft,this.restoreTemplateRef).title("Restoring").id("lm-a-arc-op-result-dialog").afterClose(i=>{i&&this.modalDialog.close(i)});t.apply(i=>{i.modalDialog=t,i.pageIdMap=e,i.operation="restore"}).open()}checkArchivedFrom(){this.originalEid?(this.isBusy=!0,this.dynamicPageService.getExistingInfo(this.originalEid).subscribe(e=>{try{e&&e.content?(this.originalEntity=e.content,this.originalTitle=this.originalEntity.title,this.isValidToRestore(e.content)?(this.isRestoreToDisabled=!1,this.restoreStrategy=mt.Original):(this.isRestoreToDisabled=!0,this.restoreStrategy=mt.New,Oe.info("The page is currently checked out by someone else"))):this.restoreStrategy=mt.New}catch(t){Oe.error("Failed to get page information "+JSON.stringify(t))}finally{this.isBusy=!1}},()=>{this.isBusy=!1})):this.restoreStrategy=mt.New}isValidToRestore(e){return e?e.lock===1?e.lockedByUser===!0:!0:!1}},us.ctorParameters=()=>[{type:F},{type:w},{type:b},{type:L}],us.propDecorators={restoreTemplateRef:[{type:f,args:["restoreTemplateRef",{read:A,static:!1}]}]},us);zt=d([p({template:Ol})],zt);var mt;(function(m){m[m.Original=0]="Original",m[m.New=1]="New",m[m.OtherPage=2]="OtherPage"})(mt||(mt={}));var gs,wn=(gs=class extends q{constructor(e,t,i,s,a,o,n){super("AdminArchiveComponent","archive",e,t,i,s,a,{isFilter:!0,isOwnerFilter:!1,isOtherUserFilter:!1,isUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Archived by me",type:H.OwnedByMe}]}),this.viewRef=o,this.adminContext=n,this.baseUrl="/admin/dynamic/page",this.createdUnsubscriber=i.onArchiveCreated().on(()=>{this.refresh()}),this.initGrid()}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId,this.isReadOnly=E.isReadOnlyUser(e)),this.refresh()}ngOnDestroy(){this.createdUnsubscriber()}getDataGrid(){return this.dataGrid}onClickDelete(e){let t="Confirm delete",i=`Are you sure that you want to delete this archived version of '${e.title}'?`;this.showConfirm(t,i).subscribe(()=>{let s=e.archiveId;this.logDebug(`Deleting archive ${s}`);let a=this.adminService.deleteArchive(s,this.baseUrl);this.withBusy(a).subscribe(()=>{let o=this.removeFromArchive(s);this.updateItems(o),this.updateCount(this.count-1,this.maxCount)},()=>{this.showError("Delete","Unable to delete archived page.")})})}onClickRestore(e){let t=e.archiveId,i=this.sohoDialogService.modal(zt,this.viewRef).title("Restore Archive").id("lm-a-arc-restore-dialog").afterClose(s=>{s&&this.adminService.raiseArchiveRestored()});i.apply(s=>{s.modalDialog=i,s.archiveId=t,s.archiveType=e.archiveType,s.baseUrl=this.baseUrl,s.originalEid=e.entityId}).open()}listItems(e){let t=this.createRequest(e);if(!t)return;let i=this.adminService.listArchive(t,this.baseUrl);this.withBusy(i).subscribe(s=>{this.addItems(s.content,s.paging),this.updateCount(s.count,s.maxCountAllowed)},s=>{this.onError(s)})}getColumns(){return[this.getSelectionColumn(),{width:360,id:"lm-a-arc-col-t",field:"title",name:"Title",sortable:!1,resizable:!0,formatter:Formatters.Expander},{width:360,id:"lm-a-arc-col-d",field:"comment",name:"Comment",sortable:!1,resizable:!0},{width:180,id:"lm-a-arc-col-cd",field:"createdDate",name:"Created date",sortable:!1,resizable:!0,formatter:S.date},{width:180,id:"lm-a-arc-col-cbn",field:"createdByName",name:"Archived by",sortable:!1,resizable:!0,formatter:S.displayName},{width:115,id:"lm-a-arc-col-tp",field:"archiveType",name:"Type",sortable:!1,resizable:!0,formatter:S.archiveType}]}getEmptyMessage(){return"No archived entities found"}getRowTemplate(){return'<div class="datagrid-cell-layout"><span class="datagrid-textarea lm-white-space-normal">{{description}}</span></div>'}initGrid(){let e=this.defaultOptions();e.selectable="single",this.datagridOptions=e}removeFromArchive(e){return this.items.filter(t=>t.archiveId!==e)}},gs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:A},{type:O}],gs.propDecorators={dataGrid:[{type:f,args:["archiveDatagrid",{static:!1}]}]},gs);wn=d([p({selector:"lm-admin-archive",template:kl})],wn);var Ll=`<div\r
	#archiveSEViewRef\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div class="row lm-margin-xl-t">\r
		<div class="twelve columns">\r
			<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
				<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-section [isSearch]="true">\r
					<input\r
						soho-toolbar-flex-searchfield\r
						[clearable]="true"\r
						[collapsible]="true"\r
						maxlength="64"\r
						[(ngModel)]="query"\r
						[disabled]="toolbarDisabled"\r
						(cleared)="clearSearch()"\r
						(lm-submit)="search()"\r
						(keydown.esc)="clearSearch()"\r
						id="lm-a-arc-se-search"\r
						(focus)="onSearchfieldFocus()"\r
						(blur)="onSearchfieldFocusLost()" />\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-section [isButtonSet]="true">\r
					<button\r
						soho-menu-button\r
						menu="lm-a-arc-se-sort"\r
						[disabled]="toolbarDisabled"\r
						type="button"\r
						icon="sort-down">\r
						{{ orderBy.name }}\r
					</button>\r
					<ul soho-popupmenu id="lm-a-arc-se-sort">\r
						<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
							<a\r
								soho-popupmenu-label\r
								[name]="item.name | lmAutoId: 'lm-a-arc-se-sortorder'"\r
								(click)="setOrderBy(item)"\r
								>{{ item.name }}</a\r
							>\r
						</li>\r
					</ul>\r
					<button\r
						soho-menu-button\r
						menu="lm-a-arc-se-flt"\r
						[disabled]="toolbarDisabled"\r
						class="btn-menu"\r
						type="button"\r
						icon="filter"\r
						soho-tooltip\r
						[title]="filterTooltip">\r
						<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
						Filter\r
					</button>\r
					<ul soho-popupmenu id="lm-a-arc-se-flt" class="is-selectable">\r
						<li\r
							soho-popupmenu-item\r
							*ngFor="let item of filterItems"\r
							[isChecked]="item.selected">\r
							<a\r
								soho-popupmenu-label\r
								[name]="item.name | lmAutoId: 'lm-a-arc-se-filteroption'"\r
								(click)="onFilter(item)"\r
								>{{ item.name }}</a\r
							>\r
						</li>\r
					</ul>\r
					<button\r
						id="lm-a-arc-se-rfr"\r
						soho-button="icon"\r
						icon="refresh"\r
						data-action="refresh"\r
						style="border: 0; margin-bottom: 0"\r
						soho-tooltip\r
						title="Refresh">\r
						<span class="audible">Refresh</span>\r
					</button>\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
			</soho-toolbar-flex>\r
\r
			<div class="contextual-toolbar toolbar is-hidden">\r
				<div class="title">Actions</div>\r
				<div class="buttonset">\r
					<button\r
						id="lm-a-arc-se-dlt"\r
						soho-button="tertiary"\r
						icon="delete"\r
						(click)="onClickDelete(selected)">\r
						Delete\r
					</button>\r
				</div>\r
			</div>\r
			<div\r
				soho-datagrid\r
				#archiveSEDatagrid\r
				id="lm-a-arc-se-grid"\r
				[gridOptions]="datagridOptions"\r
				[data]="datagridOptions.dataset"\r
				(selected)="updateSelection($event.rows)"></div>\r
\r
			<div class="lm-pull-left lm-padding-md-t">\r
				<p *ngIf="!toolbarDisabled">\r
					{{ getItemCountText() }}\r
					<span *ngIf="isSearchActive || filter.type"\r
						>There are active filters.\r
						<a id="lm-a-arc-se-clr" soho-hyperlink (click)="clearAllFilters()"\r
							>Clear all</a\r
						>\r
					</span>\r
				</p>\r
			</div>\r
			<button\r
				id="lm-a-more-btn"\r
				soho-button="secondary"\r
				(click)="more()"\r
				[disabled]="isBusy || !hasMore">\r
				More\r
			</button>\r
		</div>\r
	</div>\r
</div>\r
<div class="modal-buttonset">\r
	<button id="lm-a-arc-se-cncl" class="btn-modal" (click)="dialog?.close()">\r
		Cancel\r
	</button>\r
	<button\r
		id="lm-a-arc-se-res"\r
		class="btn-modal-primary"\r
		[disabled]="!selected"\r
		(click)="onClickRestore(selected)">\r
		Restore\r
	</button>\r
</div>\r
`;var fs,bs=(fs=class extends q{constructor(e,t,i,s,a,o,n){super("ArchiveSingleEntityDialog","archived version",e,t,i,s,a,{isFilter:!0,isOwnerFilter:!1,isOtherUserFilter:!1,isUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Archived by me",type:H.OwnedByMe}]}),this.dynamicPageService=o,this.adminContext=n,this.baseUrl="/admin/dynamic/page",this.orderBy={order:tt.Descending,entity:it.ChangeDate,name:"Newest"},this.initGrid()}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId),this.refresh()}getDataGrid(){return this.dataGrid}onClickRestore(e){let t=e.archiveId,i=this.sohoDialogService.modal(zt,this.archiveSEViewRef).title("Restore Archive").id("lm-a-se-restore-dialog").afterClose(s=>{s&&this.dialog.close(s)});i.apply(s=>{s.originalEid=this.entityId,s.modalDialog=i,s.archiveId=t,s.archiveType=e.archiveType,s.baseUrl=this.baseUrl}).open()}onClickDelete(e){let t="Confirm delete",i=`Are you sure that you want to delete this archived version of '${e.title}'?`;this.showConfirm(t,i).subscribe(()=>{let s=e.archiveId;this.logDebug(`Deleting archive ${s}`);let a=this.adminService.deleteArchive(s,this.baseUrl);this.withBusy(a).subscribe(()=>{let o=this.removeFromArchive(s);this.updateItems(o)},()=>{this.showError("Delete","Unable to delete archived page.")})})}listItems(e){let t=this.createRequest(e);if(!t)return;t.entityId=this.entityId;let i=this.adminService.listArchive(t,this.baseUrl);this.withBusy(i).subscribe(s=>{this.addItems(s.content,s.paging)},s=>{this.onError(s)})}getColumns(){return[this.getSelectionColumn(),{width:230,id:"lm-a-arc-se-col-c",field:"comment",name:"Comment",sortable:!1,resizable:!0},{width:160,id:"lm-a-arc-se-col-cd",field:"createdDate",name:"Created date",sortable:!1,resizable:!0,formatter:S.date},{width:130,id:"lm-a-arc-se-col-cbn",field:"createdByName",name:"Archived by",sortable:!1,resizable:!0,formatter:S.displayName}]}getEmptyMessage(){return"No archived entities found"}initGrid(){let e=this.defaultOptions();e.selectable="single",e.expandableRow=!1,this.datagridOptions=e}removeFromArchive(e){return this.items.filter(t=>t.archiveId!==e)}},fs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:F},{type:O}],fs.propDecorators={dataGrid:[{type:f,args:["archiveSEDatagrid",{static:!1}]}],archiveSEViewRef:[{type:f,args:["archiveSEViewRef",{read:A,static:!1}]}]},fs);bs=d([p({template:Ll})],bs);var Nl=`<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	*ngIf="!(editedPage | async)">\r
	<div class="row lm-margin-xl-t">\r
		<div class="twelve columns">\r
			<div\r
				class="lm-admin-quota-message lm-margin-xl-b lm-pull-none"\r
				*ngIf="expressionFilter">\r
				<svg\r
					class="icon icon-info"\r
					focusable="false"\r
					aria-hidden="true"\r
					role="presentation"\r
					id="lm-a-dp-cpolicy-icon">\r
					<use xlink:href="#icon-info"></use>\r
				</svg>\r
				<p class="lm-pull-left" id="lm-a-dp-cpolicy-message">\r
					Showing pages using security policy '{{ expressionFilterTitle }}'.\r
					<a\r
						id="lm-a-dp-cpolicy-link"\r
						soho-hyperlink\r
						(click)="onClickClearPolicyFilter()"\r
						>Clear filter</a\r
					>.\r
				</p>\r
			</div>\r
			<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
				<soho-toolbar-flex-section\r
					[isTitle]="true"\r
					class="lm-info-text-md"\r
					id="lm-a-dp-maxtitle">\r
					<svg\r
						soho-icon\r
						icon="alert"\r
						[alert]="true"\r
						soho-tooltip\r
						[title]="quotaTitle"\r
						*ngIf="isCloseToMaxQuota"\r
						id="lm-a-dp-maxicon"></svg>\r
					{{ toolbarTitle }}\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-section [isSearch]="true">\r
					<input\r
						soho-toolbar-flex-searchfield\r
						[clearable]="true"\r
						[collapsible]="true"\r
						maxlength="64"\r
						[(ngModel)]="query"\r
						[disabled]="toolbarDisabled"\r
						(cleared)="clearSearch()"\r
						(lm-submit)="search()"\r
						(keydown.esc)="clearSearch()"\r
						id="admin-dynamic-pages-searchfield"\r
						(focus)="onSearchfieldFocus()"\r
						(blur)="onSearchfieldFocusLost()" />\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-section [isButtonSet]="true">\r
					<!-- Sort -->\r
					<button\r
						id="lm-a-dp-sort"\r
						soho-menu-button\r
						icon="sort-down"\r
						menu="lmAdminDynamicPagesSort"\r
						[disabled]="toolbarDisabled"\r
						type="button">\r
						<span>{{ orderBy.name }}</span>\r
					</button>\r
					<ul soho-popupmenu id="lmAdminDynamicPagesSort">\r
						<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
							<a\r
								soho-popupmenu-label\r
								[name]="item.name | lmAutoId: 'lm-a-dp-sortorder'"\r
								(click)="setOrderBy(item)"\r
								>{{ item.name }}</a\r
							>\r
						</li>\r
					</ul>\r
					<button\r
						id="lm-a-dp-filter"\r
						soho-menu-button\r
						menu="lmAdminDynamicPagesFilter"\r
						[disabled]="toolbarDisabled"\r
						class="btn-menu"\r
						type="button"\r
						icon="filter"\r
						soho-tooltip\r
						[title]="filterTooltip">\r
						<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
						Filter\r
					</button>\r
					<ul\r
						soho-popupmenu\r
						id="lmAdminDynamicPagesFilter"\r
						class="is-selectable">\r
						<li\r
							soho-popupmenu-item\r
							*ngFor="let item of filterItems"\r
							[isChecked]="item.selected">\r
							<a\r
								soho-popupmenu-label\r
								[name]="item.name | lmAutoId: 'lm-a-dp-filteroption'"\r
								(click)="onFilter(item, viewContainerRef, $event)"\r
								>{{ item.name }}</a\r
							>\r
						</li>\r
					</ul>\r
					<!-- Import -->\r
					<div class="separator" *ngIf="!isReadOnly"></div>\r
					<button\r
						id="lm-a-dp-import"\r
						soho-button="tertiary"\r
						icon="import"\r
						*ngIf="!isReadOnly"\r
						data-action="openImportPageDialog">\r
						Import\r
					</button>\r
					<!-- Add page -->\r
					<div class="separator" *ngIf="!isReadOnly"></div>\r
					<button\r
						id="lm-a-dp-add"\r
						soho-button="tertiary"\r
						icon="add"\r
						*ngIf="!isReadOnly"\r
						data-action="addPage">\r
						Add Page\r
					</button>\r
					<div class="separator"></div>\r
					<!-- Refresh -->\r
					<button\r
						id="lm-a-dp-refresh"\r
						soho-button="icon"\r
						icon="refresh"\r
						data-action="refresh"\r
						style="border: 0; margin-bottom: 0"\r
						soho-tooltip\r
						title="Refresh">\r
						<span class="audible">Refresh</span>\r
					</button>\r
				</soho-toolbar-flex-section>\r
\r
				<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
			</soho-toolbar-flex>\r
\r
			<div>\r
				<ul soho-popupmenu id="lmAdminDynamicPagesMore">\r
					<li soho-popupmenu-item>\r
						<a soho-popupmenu-label (click)="preview(selected)"> Preview </a>\r
					</li>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-dp-preview-asuser"\r
							(click)="previewAsUser(selected)">\r
							Preview As User\r
						</a>\r
					</li>\r
					<div class="separator"></div>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							icon="export"\r
							id="lm-a-dp-export"\r
							(click)="exportPage(selected)">\r
							Export\r
						</a>\r
					</li>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							icon="export"\r
							id="lm-a-dp-export-translations"\r
							(click)="exportPageLocalization(selected)">\r
							Export Translation\r
						</a>\r
					</li>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							icon="import"\r
							id="lm-a-dp-import-translations"\r
							(click)="importPageLocalization(selected)"\r
							*ngIf="selected?.lockedByUser && !isReadOnly">\r
							Import Translation\r
						</a>\r
					</li>\r
					<div\r
						class="separator"\r
						*ngIf="\r
							(selected?.state === 2 && !isReadOnly) || selected?.lockedByUser\r
						"></div>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-dp-archive"\r
							(click)="openCreateArchiveDialog(selected)"\r
							*ngIf="selected?.state === 2 && !isReadOnly">\r
							Archive\r
						</a>\r
					</li>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-dp-restore"\r
							(click)="openEntityArchiveDialog(selected)"\r
							*ngIf="selected?.lockedByUser && !isReadOnly">\r
							Restore\r
						</a>\r
					</li>\r
					<div\r
						class="separator"\r
						*ngIf="selected?.lockedByUser && !isReadOnly"></div>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-dp-replace"\r
							(click)="openImportPageDialog(selected)"\r
							*ngIf="selected?.lockedByUser && !isReadOnly">\r
							Replace\r
						</a>\r
					</li>\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-dp-delete"\r
							(click)="onClickDelete(selected)"\r
							*ngIf="selected?.lockedByUser && !isReadOnly">\r
							Delete\r
						</a>\r
					</li>\r
				</ul>\r
			</div>\r
			<div class="contextual-toolbar toolbar is-hidden">\r
				<div class="title">{{ getTitle() }}</div>\r
				<div class="buttonset">\r
					<button\r
						soho-button="tertiary"\r
						icon="edit"\r
						(click)="editPage(selected)"\r
						*ngIf="selected?.lockedByUser && !isReadOnly"\r
						id="lm-a-dp-edit">\r
						Edit\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						icon="launch"\r
						(click)="viewPage(selected)"\r
						*ngIf="isReadOnly">\r
						View\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						icon="close-cancel"\r
						(click)="onClickDiscard(selected)"\r
						*ngIf="\r
							selected?.lockedByUser && selected?.state === 3 && !isReadOnly\r
						"\r
						id="lm-a-dp-discard">\r
						Discard\r
					</button>\r
					<div\r
						class="separator"\r
						*ngIf="selected?.lockedByUser && !isReadOnly"></div>\r
					<button\r
						soho-button="tertiary"\r
						icon="download"\r
						(click)="checkOutPage(selected)"\r
						*ngIf="selected?.lock !== 1 && !isReadOnly"\r
						id="lm-a-dp-checkout">\r
						Check Out\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						icon="upload"\r
						(click)="checkInPage(selected)"\r
						*ngIf="selected?.lockedByUser && !isReadOnly"\r
						id="lm-a-dp-checkin">\r
						Check In\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						icon="send"\r
						(click)="publishPage(selected)"\r
						*ngIf="selected?.lockedByUser && !isReadOnly"\r
						id="lm-a-dp-publish">\r
						Publish\r
					</button>\r
					<button\r
						soho-button="tertiary"\r
						icon="download"\r
						(click)="checkOutPage(selected, true)"\r
						*ngIf="\r
							selected?.lock === 1 && !selected?.lockedByUser && !isReadOnly\r
						"\r
						id="lm-a-dp-forcecheckout">\r
						Force Check Out\r
					</button>\r
					<div\r
						class="separator"\r
						*ngIf="selected?.lock !== 1 || selected?.lockedByUser"></div>\r
					<button\r
						soho-menu-button\r
						menu="lmAdminDynamicPagesMore"\r
						type="button"\r
						id="lm-admin-dp-more">\r
						More\r
					</button>\r
				</div>\r
			</div>\r
			<div\r
				soho-datagrid\r
				#dynamicPagesDatagrid\r
				id="gridDynamicPages"\r
				[gridOptions]="datagridOptions"\r
				[data]="datagridOptions.dataset"\r
				(selected)="updateSelection($event.rows)"></div>\r
\r
			<div class="lm-admin-quota-message lm-margin-md-t">\r
				<p *ngIf="!toolbarDisabled" id="lm-a-dp-showcounttext">\r
					{{ getItemCountText() }}\r
					<span *ngIf="isSearchActive || filter.type"\r
						>There are active filters.\r
						<a\r
							soho-hyperlink\r
							id="lm-a-dp-clear-filters"\r
							(click)="clearAllFilters()"\r
							>Clear all</a\r
						>\r
					</span>\r
				</p>\r
			</div>\r
\r
			<button\r
				id="lm-a-more-btn"\r
				soho-button\r
				type="button"\r
				(click)="more()"\r
				[disabled]="isBusy || !hasMore">\r
				More\r
			</button>\r
		</div>\r
	</div>\r
</div>\r
<lm-dynamic-page-editor *ngIf="editedPage | async"></lm-dynamic-page-editor>\r
`;var Bl=`<ng-container [formGroup]="settingsForm">\r
	<div class="field">\r
		<label class="required">Title</label>\r
		<input\r
			soho-input\r
			id="lm-a-dps-title-inp"\r
			[maxlength]="pageTitleMaxLength"\r
			formControlName="title"\r
			data-validate="required" />\r
	</div>\r
	<div class="field" *ngIf="showDescription">\r
		<label class="required">Description</label>\r
		<textarea\r
			soho-textarea\r
			id="lm-a-dps-desc-ta"\r
			[maxlength]="pageDescriptionMaxLength"\r
			formControlName="description"\r
			data-validate="required"></textarea>\r
	</div>\r
	<div class="field">\r
		<label>Color</label>\r
		<input\r
			soho-colorpicker\r
			id="lm-a-dps-color-inp"\r
			formControlName="color"\r
			[editable]="false"\r
			[showLabel]="true"\r
			[colors]="availableColors"\r
			[clearable]="false"\r
			[attributes]="{ name: 'id', value: 'lm-a-dps-page-color' }" />\r
	</div>\r
	<div class="field switch lm-margin-md-t">\r
		<input\r
			id="lm-a-dps-memo-chk"\r
			formControlName="enableMemo"\r
			type="checkbox"\r
			class="switch" />\r
		<label for="lm-a-dps-memo-chk">Show announcements below page header</label>\r
	</div>\r
	<div\r
		class="field switch lm-margin-md-t"\r
		*ngIf="settingsForm.value.enableMemo">\r
		<input\r
			id="lm-a-dps-animate-chk"\r
			formControlName="enableAnimation"\r
			type="checkbox"\r
			class="switch" />\r
		<label for="lm-a-dps-animate-chk">Animate announcements</label>\r
	</div>\r
	<div class="field lm-margin-md-t" *ngIf="settingsForm.value.enableMemo">\r
		<label id="lm-a-dps-dur-lbl" for="lm-a-dps-dur-drpd"\r
			>Slide duration (seconds)</label\r
		>\r
		<select\r
			soho-dropdown\r
			class="input-sm"\r
			formControlName="memoDuration"\r
			name="lm-a-dps-dur-drpd"\r
			[attributes]="{ name: 'id', value: 'lm-a-dps-duration' }"\r
			[noSearch]="true">\r
			<option\r
				[ngValue]="value"\r
				id="lm-a-dps-dur-option-{{ value }}"\r
				*ngFor="let value of allowedMemoDuration">\r
				{{ formatMemoDuration(value) }}\r
			</option>\r
		</select>\r
	</div>\r
</ng-container>\r
`;var Ul=`:host{display:flex;flex-direction:column;flex-wrap:wrap}
/*# sourceMappingURL=basic.css.map */
`;var Fl=`<p class="lm-margin-xl-b" #dynamicSettings>\r
	{{\r
		isCreate || isDefault\r
			? "Page configuration that will be displayed in the\r
	Page Catalog for all users."\r
			: "Add a page configuration to show an alternate\r
	title or page color for a specific set of users."\r
	}}\r
</p>\r
<div soho-tab-list-container>\r
	<div soho-tabs (beforeActivated)="onTabChange()">\r
		<ul soho-tab-list>\r
			<li soho-tab>\r
				<a soho-tab-title id="lm-a-dpsd-basictab" tabId="tab-basic">Basic</a>\r
			</li>\r
			<li soho-tab>\r
				<a soho-tab-title id="lm-a-dpsd-trantab" tabId="tab-translations"\r
					>Translations</a\r
				>\r
			</li>\r
		</ul>\r
		<div soho-tab-panel-container>\r
			<div soho-tab-panel tabId="tab-basic">\r
				<lm-dynamic-page-settings-basic\r
					[settings]="settings"\r
					[showDescription]="isDefault"\r
					(valueChanges)="setEditedSetting($event)"\r
					(validated)="\r
						settingsAreValid = $event\r
					"></lm-dynamic-page-settings-basic>\r
			</div>\r
			<div soho-tab-panel tabId="tab-translations">\r
				<lm-dynamic-page-translations\r
					[localizations]="editedSetting?.lzn"\r
					[optionsItems]="optionsItems"\r
					[isAddDisabled]="!isEnabled"\r
					(localizationChange)="onLocalizationChange($event)">\r
				</lm-dynamic-page-translations>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
<div *ngIf="!(isCreate || isDefault)" class="permission-container">\r
	<button\r
		*ngIf="!expressions"\r
		id="lm-a-dpsd-ssp-btn"\r
		soho-button="primary"\r
		icon="search-list"\r
		[disabled]="!isEnabled"\r
		(click)="openPermissionsDialog()">\r
		Select security policy\r
	</button>\r
	<p *ngIf="expressions">This configuration applies to security policy:</p>\r
	<div *ngIf="expressions" class="permission-edit">\r
		<h2><svg soho-icon icon="locked"></svg> {{ getAccessText() }}</h2>\r
		<button\r
			soho-button="tertiary"\r
			id="lm-a-dpsd-edit-btn"\r
			icon="edit"\r
			[disabled]="!isEnabled"\r
			(click)="openPermissionsDialog()">\r
			Edit\r
		</button>\r
	</div>\r
</div>\r
\r
<div class="modal-buttonset">\r
	<button\r
		type="button"\r
		id="lm-a-dpsd-cncl-btn"\r
		class="btn-modal"\r
		(click)="close()">\r
		Cancel\r
	</button>\r
	<button\r
		type="button"\r
		id="lm-a-dpsd-save-btn"\r
		class="btn-modal-primary no-validation"\r
		(click)="save()"\r
		[disabled]="saveDisabled()">\r
		{{ isEnabled ? "Save" : "OK" }}\r
	</button>\r
</div>\r
`;var zl=`.permission-container{display:flex;flex-direction:column;border-top:1px solid #bdbdbd;padding-top:20px;margin-bottom:10px}.permission-edit{display:flex;flex-direction:row;margin-top:5px}.permission-edit h2{flex:1 1 auto;font-weight:700;margin-top:5px;vertical-align:middle}.permission-edit svg{top:3px}
/*# sourceMappingURL=basic.css.map */
`;var Wl=`<div style="width: 550px">\r
	<lm-dynamic-permissions\r
		[listLabel]="listLabel"\r
		[selectedExpressions]="selectedExpressions"\r
		[showRecent]="showRecent"\r
		[showOperator]="showOperator"\r
		[operator]="operator"\r
		(selectedChange)="onSelected($event)"></lm-dynamic-permissions>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-ssp-cancel-btn"\r
			class="btn-modal"\r
			(click)="modalDialog?.close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-ssp-save-btn"\r
			class="btn-modal-primary"\r
			(click)="save()"\r
			[disabled]="!selected && (isRequired || !selectedExpressions)">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var Gl=`<p class="permission-label">{{ listLabel }}</p>\r
\r
<div class="permissions-toolbar">\r
	<input\r
		soho-toolbar-searchfield\r
		id="lm-a-ssp-search-inp"\r
		[(ngModel)]="query"\r
		(ngModelChange)="onSearch($event)"\r
		[clearable]="true"\r
		(cleared)="clearSearch()"\r
		placeholder="Search for policies..." />\r
	<ng-container *ngIf="showOperator">\r
		<label class="label">Match selected</label>\r
		<select\r
			name="lm-a-ssp-match"\r
			style="margin-top: 8px"\r
			soho-dropdown\r
			[attributes]="{ name: 'id', value: 'lm-a-ssp-match' }"\r
			class="dropdown-xs"\r
			[(ngModel)]="operator"\r
			(change)="onOperatorChange()">\r
			<option value="||">Any</option>\r
			<option value="&&">All</option>\r
		</select>\r
	</ng-container>\r
</div>\r
\r
<soho-swaplist\r
	availableCardTitle="Security Policies"\r
	selectedCardTitle="Selected"\r
	(beforeswap)="onBeforeSwap()"\r
	(updated)="onSwapUpdate()"\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy"\r
	[attributes]="idAttr">\r
</soho-swaplist>\r
<div class="footer-container">\r
	<div\r
		class="warning-container"\r
		*ngIf="brokenPoliciesMessage$ | async as brokenPoliciesMessage">\r
		<svg\r
			soho-icon\r
			id="lm-a-ssp-tooltip"\r
			icon="alert"\r
			[alert]="true"\r
			soho-tooltip\r
			placement="right"\r
			[popover]="true"\r
			content="#lm-a-ssp-invalid"></svg>\r
		<div id="lm-a-ssp-invalid" class="hidden">\r
			<fieldset>\r
				<legend>\r
					<svg soho-icon icon="alert" style="top: 0" [alert]="true"></svg>\r
					{{ brokenPoliciesMessage.header }}\r
				</legend>\r
				<div class="summary-form">\r
					<small>{{ brokenPoliciesMessage.message }}</small>\r
					<div class="field lm-margin-xl-t lm-margin-sm-b">\r
						<span\r
							*ngFor="\r
								let invalidTitle of brokenPoliciesMessage.invalidTitles;\r
								let last = last\r
							"\r
							class="data lm-display-inline"\r
							>{{ invalidTitle + (last ? "" : ", ") }}</span\r
						>\r
					</div>\r
				</div>\r
			</fieldset>\r
		</div>\r
	</div>\r
	<div class="actions-container">\r
		<ng-container *ngIf="isAdministrator$ | async; else viewButton">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-ssp-edit-btn"\r
				icon="edit"\r
				[disabled]="!editInfo"\r
				(click)="onEdit()">\r
				Edit Policy\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-ssp-add-btn"\r
				icon="add"\r
				(click)="onAdd()">\r
				Add New Policy\r
			</button>\r
		</ng-container>\r
		<ng-template #viewButton>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-ssp-view-btn"\r
				[disabled]="!editInfo"\r
				(click)="onView()">\r
				View Policy\r
			</button>\r
		</ng-template>\r
	</div>\r
</div>\r
`;var Vl=`.permission-label{margin-bottom:10px}:host ::ng-deep .searchfield-wrapper{margin-bottom:10px}:host ::ng-deep .searchfield{width:275px}.permissions-toolbar{display:flex;align-items:center;justify-content:space-between}.permissions-toolbar .label{margin-left:auto;margin-right:10px}.permissions-toolbar ::ng-deep .dropdown-wrapper{margin-bottom:10px}html[dir=rtl] :host .permissions-toolbar .label{margin-left:10px;margin-right:auto}soho-swaplist{display:inline-block;width:100%}soho-swaplist ::ng-deep .card{margin-bottom:0}soho-swaplist ::ng-deep .card .card-content .listview{max-height:none}soho-swaplist ::ng-deep .selected .listview{height:100%}soho-swaplist ::ng-deep .recent-expression-border{border-bottom:1px solid #bdbdbd}soho-swaplist ::ng-deep span.handle.draggable{font-size:30px}soho-swaplist ::ng-deep .swaplist-item-content>p{word-break:break-word}.footer-container{padding:5px 0 5px 5px;display:flex}.footer-container .actions-container{flex:1 0 auto;text-align:right}.footer-container .warning-container>svg{top:7px}
/*# sourceMappingURL=permissions.css.map */
`;var _l=`\uFEFF<div\r
	#policyViewRef\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy"\r
	style="min-width: 800px">\r
	<div class="title-row">\r
		<div class="field">\r
			<label class="label required">Name</label>\r
			<input\r
				id="lm-a-sp-edit-name"\r
				[(ngModel)]="policy.name"\r
				data-validate="required"\r
				maxlength="128"\r
				class="lm-margin-zero-b"\r
				[disabled]="isViewMode" />\r
			<span></span>\r
		</div>\r
	</div>\r
\r
	<soho-toolbar [maxVisibleButtons]="7" [rightAligned]="true">\r
		<soho-toolbar-button-set>\r
			<button\r
				id="lm-a-sp-edit-test-btn"\r
				soho-button="tertiary"\r
				*ngIf="isViewMode; else editable"\r
				(click)="test()">\r
				Test security policy\r
			</button>\r
			<ng-template #editable>\r
				<button\r
					id="lm-a-sp-edit-add"\r
					soho-button="tertiary"\r
					[disabled]="isViewMode"\r
					icon="add"\r
					(click)="addEntry()">\r
					Add Rule\r
				</button>\r
				<button\r
					id="lm-a-sp-more-btn"\r
					soho-context-menu\r
					trigger="click"\r
					menu="lm-a-sp-edit-menu"\r
					class="btn-actions">\r
					<svg soho-icon icon="more"></svg>\r
				</button>\r
				<ul soho-popupmenu id="lm-a-sp-edit-menu">\r
					<li soho-popupmenu-item>\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-sp-edit-test-menu"\r
							(click)="test()">\r
							Test security policy\r
						</a>\r
					</li>\r
				</ul>\r
			</ng-template>\r
		</soho-toolbar-button-set>\r
	</soho-toolbar>\r
\r
	<div class="lm-hdr-bg entry match default">\r
		<label class="label">Match</label>\r
		<select\r
			name="lm-a-sp-edit-match"\r
			soho-dropdown\r
			[attributes]="{ name: 'id', value: 'lm-a-sp-edit-match' }"\r
			[disabled]="isViewMode"\r
			class="dropdown-xs"\r
			[(ngModel)]="policy.match">\r
			<option value="||">Any</option>\r
			<option value="&&">All</option>\r
		</select>\r
		<label class="label">of the following rules:</label>\r
	</div>\r
\r
	<div class="entry-list">\r
		<ng-container\r
			*ngTemplateOutlet="\r
				expEntries;\r
				context: { entries: this.policy.value, isTopLevel: true }\r
			">\r
		</ng-container>\r
	</div>\r
\r
	<ng-template #expEntries let-entries="entries" let-isTopLevel="isTopLevel">\r
		<ng-container\r
			*ngFor="\r
				let entry of entries;\r
				let first = first;\r
				let i = index;\r
				let count = count\r
			">\r
			<div class="group" *ngIf="entry.children; else expression">\r
				<div class="entry match" [ngClass]="{ 'top-level lm-bg': isTopLevel }">\r
					<select\r
						[attr.data-lm-a-sp-edit-match]="i"\r
						[name]="'lm-a-sp-edit-match-selector-' + i"\r
						soho-dropdown\r
						[attributes]="{\r
							name: 'id',\r
							value: 'lm-a-sp-edit-match-selector-' + i\r
						}"\r
						[disabled]="isViewMode"\r
						class="dropdown-xs"\r
						[(ngModel)]="entry.match">\r
						<option value="||">Any</option>\r
						<option value="&&">All</option>\r
					</select>\r
					<label class="label">of the following rules:</label>\r
					<button\r
						[attr.data-lm-a-sp-edit-more]="i"\r
						[name]="'lm-a-sp-edit-more-button-' + i"\r
						soho-context-menu\r
						[disabled]="isViewMode"\r
						trigger="click"\r
						[menu]="'group-menu-' + entry.id"\r
						class="btn-actions">\r
						<svg soho-icon icon="more"></svg>\r
					</button>\r
					<ul soho-popupmenu [id]="'group-menu-' + entry.id">\r
						<li soho-popupmenu-item>\r
							<a\r
								soho-popupmenu-label\r
								[attr.data-lm-a-sp-edit-dlt-grp]="i"\r
								[name]="'lm-a-sp-edit-delete-group-' + i"\r
								(click)="deleteGroup(entry)">\r
								Delete group\r
							</a>\r
						</li>\r
					</ul>\r
				</div>\r
				<ng-container\r
					*ngTemplateOutlet="\r
						expEntries;\r
						context: { entries: entry.children }\r
					"></ng-container>\r
			</div>\r
			<ng-template #expression>\r
				<div\r
					class="compound-field entry"\r
					[ngClass]="{ 'top-level lm-bg': isTopLevel }"\r
					[class.first]="first">\r
					<div class="field">\r
						<select\r
							[attr.data-lm-a-sp-edit-entity]="i"\r
							[name]="'lm-a-sp-edit-entry-entity-selector-' + i"\r
							soho-dropdown\r
							[attributes]="{\r
								name: 'id',\r
								value: 'lm-a-sp-edit-entry-entity-selector-' + i\r
							}"\r
							[disabled]="isViewMode"\r
							#entityDropdown\r
							class="dropdown-mm"\r
							[(ngModel)]="entry.entity"\r
							(change)="onEntityChanged(entry, entityDropdown)">\r
							<option [ngValue]="0">User property</option>\r
							<option [ngValue]="1">Role</option>\r
							<option [ngValue]="2">Distribution group</option>\r
						</select>\r
					</div>\r
					<div class="field" *ngIf="entry.entity === 0">\r
						<select\r
							[attr.data-lm-a-sp-edit-attr]="i"\r
							[name]="'lm-a-sp-edit-entry-attribute-selector-' + i"\r
							soho-dropdown\r
							[attributes]="{\r
								name: 'id',\r
								value: 'lm-a-sp-edit-entry-attribute-selector-' + i\r
							}"\r
							[disabled]="isViewMode"\r
							#attributeDropdown\r
							class="dropdown-sm"\r
							[(ngModel)]="entry.attr"\r
							(change)="onAttributeChanged(entry, attributeDropdown)">\r
							<option *ngFor="let attr of attributes" [ngValue]="attr">\r
								{{ attr.name }}\r
							</option>\r
						</select>\r
					</div>\r
					<div class="field">\r
						<select\r
							[attr.data-lm-a-sp-edit-op]="i"\r
							[name]="'lm-a-sp-edit-entry-operator-selector-' + i"\r
							soho-dropdown\r
							[attributes]="{\r
								name: 'id',\r
								value: 'lm-a-sp-edit-entry-operator-selector-' + i\r
							}"\r
							[disabled]="isViewMode"\r
							class="dropdown-sm"\r
							[(ngModel)]="entry.operator"\r
							(change)="onOperatorChanged(entry)">\r
							<option\r
								*ngFor="\r
									let operator of operators\r
										| operatorPipe\r
											: entry.entity\r
											: entry.attr?.type\r
											: entry.attr?.hasValues\r
											: entry.attr?.isMultiValue\r
								"\r
								[value]="operator.value">\r
								{{ operator.label }}\r
							</option>\r
						</select>\r
					</div>\r
					<div class="field">\r
						<ng-container *ngIf="entry.entity !== 0; else attribute">\r
							<input\r
								[attr.data-lm-a-sp-edit-role-auto]="i"\r
								[name]="'lm-a-sp-edit-entry-role-autocomplete-' + i"\r
								soho-autocomplete\r
								[autoSelectFirstItem]="true"\r
								[attributes]="{\r
									name: 'name',\r
									value: 'lm-a-sp-edit-entry-role-search-' + i\r
								}"\r
								style="margin-top: 2px"\r
								[disabled]="isViewMode"\r
								placeholder="Type to search..."\r
								[(ngModel)]="entry.value"\r
								(selected)="onAutoSelect($event, entry)"\r
								[source]="roleSource"\r
								[template]="autocompleteTemplate"\r
								maxlength="256"\r
								*ngIf="entry.entity === 1" />\r
							<input\r
								[attr.data-lm-a-sp-edit-grp-auto]="i"\r
								[name]="'lm-a-sp-edit-entry-group-autocomplete-' + i"\r
								soho-autocomplete\r
								[autoSelectFirstItem]="true"\r
								[attributes]="{\r
									name: 'name',\r
									value: 'lm-a-sp-edit-entry-group-search-' + i\r
								}"\r
								style="margin-top: 2px"\r
								[disabled]="isViewMode"\r
								placeholder="Type to search..."\r
								[(ngModel)]="entry.value"\r
								(selected)="onAutoSelect($event, entry)"\r
								[source]="groupSource"\r
								[template]="autocompleteTemplate"\r
								maxlength="256"\r
								*ngIf="entry.entity === 2" />\r
						</ng-container>\r
						<ng-template #attribute>\r
							<input\r
								[(ngModel)]="entry.value"\r
								[disabled]="isViewMode"\r
								class="input-mm"\r
								style="margin-top: 2px"\r
								maxlength="256"\r
								*ngIf="\r
									!entry.attr ||\r
									(entry.attr.type === 's' && !entry.attr.hasValues)\r
								" />\r
							<input\r
								[attr.data-lm-a-sp-edit-val-inp]="i"\r
								[name]="'lm-a-sp-edit-entry-value-input-' + i"\r
								[(ngModel)]="entry.value"\r
								[disabled]="isViewMode"\r
								class="input-mm"\r
								style="margin-top: 2px"\r
								soho-input\r
								maxlength="256"\r
								soho-mask\r
								process="number"\r
								[allowThousandsSeparator]="false"\r
								[allowDecimal]="true"\r
								*ngIf="entry.attr?.type === 'n' && !entry.attr?.hasValues" />\r
							<select\r
								[attr.data-lm-a-sp-edit-val-sel]="i"\r
								[name]="'lm-a-sp-edit-entry-value-selector-' + i"\r
								soho-dropdown\r
								[attributes]="{\r
									name: 'id',\r
									value: 'lm-a-sp-edit-entry-value-selector-' + i\r
								}"\r
								[disabled]="isViewMode"\r
								class="dropdown-mm"\r
								[(ngModel)]="entry.value"\r
								(change)="setAttributeValid(entry)"\r
								*ngIf="\r
									entry.attr?.type !== 'b' &&\r
									entry.attr?.type !== 'd' &&\r
									entry.attr?.hasValues\r
								">\r
								<option\r
									*ngFor="let attribute of entry.attr.values"\r
									[value]="attribute.val">\r
									{{ attribute.val }}\r
								</option>\r
							</select>\r
							<input\r
								[attr.data-lm-a-sp-edit-val-date]="i"\r
								[name]="'lm-a-sp-edit-entry-datepicker-' + i"\r
								soho-datepicker\r
								[attributes]="{\r
									name: 'name',\r
									value: 'lm-a-sp-edit-entry-datepicker-' + i\r
								}"\r
								[disabled]="isViewMode"\r
								class="input-mm"\r
								style="margin-top: 2px"\r
								*ngIf="entry.attr?.type === 'd'"\r
								[(ngModel)]="entry.value" />\r
							<select\r
								[attr.data-lm-a-sp-edit-val-attr]="i"\r
								[name]="'lm-a-sp-edit-entry-attribute-selector-value-' + i"\r
								soho-dropdown\r
								[attributes]="{\r
									name: 'id',\r
									value: 'lm-a-sp-edit-entry-attribute-selector-value-' + i\r
								}"\r
								[disabled]="isViewMode"\r
								class="dropdown-mm"\r
								[(ngModel)]="entry.value"\r
								(change)="setAttributeValid(entry)"\r
								*ngIf="entry.attr?.type === 'b'">\r
								<ng-container *ngIf="entry.attr.hasValues; else defaultvalues">\r
									<option [value]="entry.attr.values[0].val">\r
										{{ entry.attr.values[0].des }}\r
									</option>\r
									<option [value]="entry.attr.values[1].val">\r
										{{ entry.attr.values[1].des }}\r
									</option>\r
								</ng-container>\r
								<ng-template #defaultvalues>\r
									<option value="1">True</option>\r
									<option value="0">False</option>\r
								</ng-template>\r
							</select>\r
						</ng-template>\r
					</div>\r
					<button\r
						[attr.data-lm-a-sp-edit-rulemore]="i"\r
						[name]="'lm-a-sp-edit-entry-menu-button-' + i"\r
						soho-context-menu\r
						[disabled]="isViewMode"\r
						[removeOnDestroy]="true"\r
						trigger="click"\r
						[menu]="'expression-menu-' + entry.id"\r
						class="btn-actions">\r
						<svg soho-icon icon="more"></svg>\r
					</button>\r
					<ul soho-popupmenu [id]="'expression-menu-' + entry.id">\r
						<li soho-popupmenu-item>\r
							<a\r
								soho-popupmenu-label\r
								[attr.data-lm-a-sp-edit-addbelow]="i"\r
								[name]="'lm-a-sp-edit-entry-addbelow-' + i"\r
								(click)="addEntry(entries, entry, i)">\r
								Add below\r
							</a>\r
						</li>\r
						<li soho-popupmenu-item *ngIf="isTopLevel">\r
							<a\r
								soho-popupmenu-label\r
								[attr.data-lm-a-sp-edit-movegrp]="i"\r
								[name]="'lm-a-sp-edit-entry-movetogroup-' + i"\r
								(click)="addGroup(entry, i)">\r
								Move to group\r
							</a>\r
						</li>\r
						<li soho-popupmenu-item *ngIf="!isTopLevel">\r
							<a\r
								soho-popupmenu-label\r
								[attr.data-lm-a-sp-edit-movetop]="i"\r
								[name]="'lm-a-sp-edit-entry-movetotop-' + i"\r
								(click)="moveToTop(entries, entry)">\r
								Move to top level\r
							</a>\r
						</li>\r
						<ng-container>\r
							<li soho-popupmenu-separator></li>\r
							<li soho-popupmenu-item>\r
								<a\r
									soho-popupmenu-label\r
									[attr.data-lm-a-sp-edit-del]="i"\r
									[name]="'lm-a-sp-edit-entry-delete-' + i"\r
									(click)="deleteEntry(entries, entry, !isTopLevel)">\r
									Delete\r
								</a>\r
							</li>\r
						</ng-container>\r
					</ul>\r
					<lm-invalid-policy-attribute\r
						*ngIf="entry.invalidAttribute || entry.invalidAttributeValue"\r
						[entry]="entry"\r
						[operators]="operators"></lm-invalid-policy-attribute>\r
				</div>\r
			</ng-template>\r
		</ng-container>\r
	</ng-template>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			id="lm-sp-edit-close"\r
			*ngIf="isViewMode; else saveCancel"\r
			class="btn-modal-primary"\r
			style="width: 100%"\r
			(click)="close()"\r
			[disabled]="isBusy">\r
			Close\r
		</button>\r
		<ng-template #saveCancel>\r
			<button\r
				id="lm-sp-edit-cncl"\r
				class="btn-modal"\r
				as\r
				style="width: 50%"\r
				(click)="close()"\r
				[disabled]="isBusy">\r
				Cancel\r
			</button>\r
			<button\r
				id="lm-sp-edit-save"\r
				class="btn-modal-primary"\r
				style="width: 50%"\r
				(click)="onOk()"\r
				[disabled]="isBusy">\r
				Save\r
			</button>\r
		</ng-template>\r
	</div>\r
</div>\r
`;var Zl=`.title-row{display:flex}.title-row .field{flex:1 0 auto}.title-row .menu-wrapper{display:flex;align-items:center}.entry{padding:5px;display:flex;align-items:center;margin-bottom:20px}.entry .field{margin-bottom:0}.entry button[soho-context-menu]{position:absolute;right:5px;top:5px}.entry.compound-field{position:relative;padding-right:40px}.entry.compound-field:before,.entry.match:not(.default):before{content:"";width:19px;height:43px;border-bottom:solid 1px #555555;border-left:solid 1px #555555;position:absolute;left:-20px;top:-20px}.entry.compound-field:not(.top-level){padding-left:45px}.entry.compound-field:not(.top-level):before{left:25px}.entry.compound-field:not(.top-level):not(.first):before{top:-45px;height:68px}.match{height:47px}.match ::ng-deep .dropdown-wrapper{margin-bottom:0}.match .label{margin:0 5px 0 0}.match.top-level .label,.match.default .label:last-child{margin-right:0;margin-left:5px}.match.default{padding:5px 10px}.match.default .label{font-size:1.4rem;line-height:1.4rem}.entry-list{padding:0 35px;position:relative}.entry-list:before{content:"";width:1px;height:calc(100% - 5px);border-left:solid 1px #555555;position:absolute;left:15px;top:-20px}.group{position:relative;display:flex;flex-direction:column}.group:last-child:before{content:"";width:20px;height:calc(100% - 24px);position:absolute;background-color:#fff;left:-20px;top:24px}:host-context(.lm-theme-dark) .group:last-child:before{background-color:#414247}:host-context(.lm-theme-contrast) .group:last-child:before{background-color:#f0f0f0}[soho-button=icon]{margin:0}
/*# sourceMappingURL=policy.css.map */
`;var jl=`:host{position:absolute;right:-40px;top:5px}button[soho-button=icon]{margin-right:0}legend .icon{top:0}
/*# sourceMappingURL=policy.css.map */
`;var Yl=`\uFEFF<div\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy"\r
	style="max-width: 600px">\r
	<div class="field">\r
		<input\r
			soho-checkbox\r
			id="lm-a-sp-tst-im"\r
			type="checkbox"\r
			[(ngModel)]="isImpersonation" />\r
		<label soho-label for="lm-a-sp-tst-im" [forCheckBox]="true"\r
			>Impersonate</label\r
		>\r
	</div>\r
\r
	<div class="lm-margin-lg-t">\r
		<div *ngFor="let item of items; let i = index">\r
			<div class="field lm-truncate-text" *ngIf="item.type === 'b'">\r
				<input\r
					soho-checkbox\r
					type="checkbox"\r
					id="lm-a-sp-tst-bval{{ i }}"\r
					[attr.disabled]="isImpersonation ? null : true"\r
					[(ngModel)]="item.selected" />\r
				<label soho-label for="lm-a-sp-tst-bval{{ i }}" [forCheckBox]="true">{{\r
					item.label\r
				}}</label>\r
			</div>\r
			<div class="field lm-margin-md-t" *ngIf="item.type !== 'b'">\r
				<label for="lm-a-sp-tst-val{{ i }}" class="label">{{\r
					item.label\r
				}}</label>\r
				<input\r
					id="lm-a-sp-tst-val{{ i }}"\r
					*ngIf="item.type === 's' || item.attribute?.hasValues"\r
					maxlength="256"\r
					[attr.disabled]="isImpersonation ? null : true"\r
					[(ngModel)]="item.value" />\r
				<input\r
					id="lm-a-sp-tst-nval-{{ i }}"\r
					[(ngModel)]="item.value"\r
					class="input-mm"\r
					soho-input\r
					maxlength="256"\r
					[attr.disabled]="isImpersonation ? null : true"\r
					soho-mask\r
					process="number"\r
					[allowThousandsSeparator]="false"\r
					[allowDecimal]="true"\r
					*ngIf="item.type === 'n'" />\r
				<input\r
					id="lm-a-sp-tst-dval{{ i }}"\r
					soho-datepicker\r
					[attributes]="{ name: 'id', value: 'lm-a-sp-tst-dval' + i }"\r
					class="input-mm"\r
					[attr.disabled]="isImpersonation ? null : true"\r
					*ngIf="item.type === 'd'"\r
					[(ngModel)]="item.value" />\r
			</div>\r
		</div>\r
	</div>\r
\r
	<button\r
		id="lm-a-sp-tst-eval"\r
		class="btn-secondary lm-margin-lg-t"\r
		[disabled]="isBusy"\r
		(click)="onEvaluate()">\r
		Evaluate\r
	</button>\r
\r
	<h3 class="lm-margin-lg-t" *ngIf="message">{{ message }}</h3>\r
\r
	<div class="modal-buttonset">\r
		<button id="lm-a-sp-tst-close" class="btn-modal" (click)="onClose()">\r
			Close\r
		</button>\r
	</div>\r
</div>\r
`;var $l=`.field{padding-left:1px}
/*# sourceMappingURL=policy-test.css.map */
`;var vs,ys=(vs=class extends J{constructor(e,t){super("PolicyTestComponent",e),this.adminService=t,this.isImpersonation=!0}ngOnInit(){let e=this.options,t=this.toAttributes(e.attributes),i=this.toItem(e.roles,!0),s=this.toItem(e.groups,!1),a=t.concat(s).concat(i);u.sortByProperty(a,"label"),this.items=a}onClose(){this.closeWithResult(C.Ok,!0)}onEvaluate(){this.message=null;let e=this.createRequest();this.setBusy(!0),this.adminService.testExpression(e).subscribe(t=>{this.message="Evaluation result: "+t.content,this.setBusy(!1)},()=>{this.message="Failed to evaluate security policy",this.setBusy(!1)})}createRequest(){let e={content:this.options.expInfo};return this.isImpersonation&&this.addRequestItems(e),e}addRequestItems(e){let t=[],i=[],s={};for(let a of this.items){let o=a.selected;if(a.isAttribute){let n;a.type==="b"?n=o?"1":"0":a.type==="d"?n=E.getIsoDateString(a.value):n=a.value,n&&(s[a.label]=[n])}else o&&(a.isRole?i.push(a.label):a.isGroup&&t.push(a.label))}e.attributes=s,e.groups=t,e.roles=i}toAttributes(e){let t=[];for(let i of Object.keys(e)){let s=e[i];t.push({label:s.name,selected:!1,type:s.type,isAttribute:!0})}return t}toItem(e,t){let i=[];for(let s of Object.keys(e))i.push({label:s,selected:!1,type:"b",isRole:t,isGroup:!t});return i}},vs.ctorParameters=()=>[{type:b},{type:y}],vs.propDecorators={isImpersonation:[{type:h}]},vs);ys=d([p({template:Yl,styles:[$l]})],ys);var Qa;(function(m){m.Any="||",m.All="&&"})(Qa||(Qa={}));var We;(function(m){m[m.Attribute=0]="Attribute",m[m.Role=1]="Role",m[m.Group=2]="Group"})(We||(We={}));var Ja=class{transform(e,t,i,s,a){let o=[];if(t!==We.Attribute){let n="{g}{r}";o=e.filter(r=>r.types.includes(n))}else{s&&(i+=a?"mv":"v");let n="{"+i+"}";o=e.filter(r=>r.types.includes(n))}return o}};Ja=d([Ve({name:"operatorPipe"})],Ja);var Jn=class Jn{static getClientSchema(e,t){let i={r:We.Role,g:We.Group,a:We.Attribute},s=Z=>Z&&Z.length>0?Z.charAt(0):null,a=Z=>{let me=s(Z);return me==="r"||me=="g"},o=Z=>i[s(Z)]||"",n=[],r,l,c,g,P,z=(Z,me)=>{let De=Z.c;for(let se of De)if(se.v==="()"){let X={match:se.c[0].v,children:[],id:W.random(5)};me.push(X),z(se.c[0],X.children)}else{let X=se.c[0].v;if(a(X))c=null,r=o(X),l=X.length==2?"ss":se.v==="=="?"m":"!m",P=se.c[0].c[0].v;else{if(X==="sc"||X==="ss"||X==="se"||X==="mc")P=se.c[0].c[1].v,X==="mc"?(c=se.c[0].c[0].v,se.v=="!="&&(X="!mc"),g="s"):(c=se.c[0].c[0].c[0].v,g=X[0]),l=X;else{let Be=se.c[1].v,ae=Be;X==="ad"&&(ae=E.getLocaleDateStringShort(Be)),P=ae,c=se.c[0].c[0].v,g=X[1],l=se.v}r=We.Attribute}me.push({entity:r,operator:l,value:P,attr:c?u.itemByProperty(t,"name",c)||{name:c,type:g}:null,id:W.random(5)})}};return z(e.expression,n),{id:e.expressionId||W.random(),name:e.title,match:e.expression.v||Qa.All,value:n}}static getServerSchema(e){let t=[],i={t:"n",v:"1"},s=l=>({t:"s",v:l}),a=(l,c)=>({t:"op",v:l,c}),o=(l,c)=>({t:"fnc",v:l,c}),n=(l,c)=>[o(l,[s(c)]),i],r=(l,c)=>{for(let g of l){let P,z;if(g.match){let Z=[];r(g.children,Z),z=[a(g.match,Z)],c.push(a("()",z))}else{let Z=g.operator;["ss","se","sc","m","mc"].indexOf(Z)!==-1?P="==":Z==="!m"?P="!=":Z==="!mc"?(P="!=",Z="mc"):P=Z;let me=g.entity,De=g.value;if(me===We.Role){let se=Z=="ss"?"rs":"r";z=n(se,De)}else if(me===We.Group){let se=Z=="ss"?"gs":"g";z=n(se,De)}else{let se=g.attr,X=se.name,Be=se.type;if(Z=="mc")z=[o("mc",[s(X),s(De)]),i];else if(Be!=="s"||Z==="=="||Z==="!="){let ae=Be==="d";De=ae?E.getIsoDateString(De):De;let sn=ae?"s":Be;z=[o(`a${Be}`,[s(X)]),{t:sn,v:De}]}else z=[o(Z,[o("as",[s(X)]),s(De)]),i]}c.push(a(P,z))}}};return r(e.value,t),{title:e.name,expression:a(e.match,t)}}static getOperators(){return this.operators}static getEditorTitle(e){let t="";switch(e){case Se.Add:t="Add Security Policy";break;case Se.Edit:case Se.Copy:t="Edit Security Policy";break;case Se.View:default:t="View Security Policy"}return t}};Jn.operators=[{value:"==",label:"Equals",types:"{n}{s}{bv}{sv}"},{value:"!=",label:"Not equals",types:"{n}{s}{bv}{sv}"},{value:"==",label:"On",types:"{d}"},{value:"!=",label:"Not on",types:"{d}"},{value:"m",label:"Member of",types:"{g}{r}"},{value:"!m",label:"Not member of",types:"{g}{r}"},{value:"sc",label:"Contains",types:"{s}"},{value:"ss",label:"Starts with",types:"{s}{g}{r}"},{value:"se",label:"Ends with",types:"{s}"},{value:">",label:"Greater than",types:"{n}"},{value:">=",label:"Greater than or equal",types:"{n}"},{value:"<",label:"Less than",types:"{n}"},{value:"<=",label:"Less than or equal",types:"{n}"},{value:">",label:"After",types:"{d}"},{value:">=",label:"On or after",types:"{d}"},{value:"<",label:"Before",types:"{d}"},{value:"<=",label:"On or before",types:"{d}"},{value:"mc",label:"Contains",types:"{smv}"},{value:"!mc",label:"Does not contain",types:"{smv}"}];var pt=Jn,Se;(function(m){m[m.Add=0]="Add",m[m.Edit=1]="Edit",m[m.Copy=2]="Copy",m[m.View=3]="View"})(Se||(Se={}));var xs,wt=(xs=class extends J{constructor(e,t,i,s,a){super("EditPolicyComponent",e),this.commonDataService=t,this.adminContext=i,this.adminService=s,this.sohoModalDialogService=a,this.attributes=[],this.policy={},this.operators=pt.getOperators(),this.maxEntriesPerPolicy=25}ngOnInit(){this.isViewMode=this.mode===Se.View}ngAfterViewInit(){this.initModalDialog(),this.setBusy(!0),this.commonDataService.listAttributes().subscribe(e=>{this.postInit(e.content)},()=>{this.postInit([])})}onOk(){this.isPolicyValid()?this.save():this.isPolicyEmpty()?this.showMessageInvalidEmpty():this.isOnlyASingleGroup()?this.showMessageInvalidOneGroup():this.showMessageInvalid()}test(){if(this.isPolicyValid()){let e=this.createTestOptions(),t=this.sohoModalDialogService.modal(ys,this.policyView).title("Security Policy Tester").id("lm-a-sp-policytester-dialog");t.apply(i=>{i.modalDialog=t,i.options=e}).open()}else this.showMessageInvalid()}onEntityChanged(e,t){e.attr=null,e.operator=null,e.value=null,this.setAttributeValid(e),t.updated()}onAttributeChanged(e,t){e.operator=null,e.value=null,this.setAttributeValid(e),t.updated()}onOperatorChanged(e){}onAutoSelect(e,t){let i=e[2];i&&i.value&&(t.value=i.value)}deleteEntry(e,t,i){if(u.remove(e,t),!e.length&&i){let s=this.policy.value.find(a=>a.children&&!a.children.length);u.remove(this.policy.value,s)}}addEntry(e,t,i){if(!!this.isMaxEntries()){this.messageService.message({title:"Unable to add expression",message:"The max limit has been reached ("+this.maxEntriesPerPolicy+")",buttons:[{text:"OK",id:"lm-a-sp-maxlimit-message-ok",click:(a,o)=>{o.close(!0)},isDefault:!0}],attributes:{name:"id",value:"lm-a-sp-maxlimit-message"}}).open();return}if(e||(e=this.policy.value),e.push({entity:We.Attribute,operator:null,value:null,attr:null,id:this.getId()}),t){let a=u.indexOf(e,t)+1;u.move(e,e.length-1,a)}}addGroup(e,t){let i=this.policy.value;i.push({match:Qa.All,children:[D({},e)],id:this.getId()}),u.move(i,parent.length-1,t),u.remove(i,e)}deleteGroup(e){u.remove(this.policy.value,e)}moveToTop(e,t){let i=this.policy.value;if(i.push(t),u.remove(e,t),!e.length){let s=i.find(a=>a.children&&!a.children.length);u.remove(i,s)}}getId(){return W.random(5)}setAttributeValid(e){e.invalidAttribute=!1,e.invalidAttributeValue=!1}postInit(e){this.setBusy(!1),this.attributes=e.filter(i=>i.category===da.Additional),this.extendAttributes();let t=this.policyEdit;t&&t.expression.c?(this.policy=pt.getClientSchema(t,this.attributes),this.validateAttributes()):(this.policy=this.createNewPolicy(),this.addEntry(this.policy.value)),this.setupSources()}save(){let e=pt.getServerSchema(this.policy),t=this.mode===Se.Edit;if(t){if(!this.isPolicyChanged(e)){this.showMessageUnchanged();return}e.expressionId=this.policy.id}this.setBusy(!0);let i={content:e},s=this.adminService;(t?s.updateExpression(i):s.createExpression(i)).subscribe(o=>{t&&!o.content.changeDate?(this.showMessageUnchanged(),this.setBusy(!1)):this.closeWithResult(C.Ok,o.content)},o=>{this.adminService.handleError(o,o.getErrorMessages()),this.setBusy(!1)})}isPolicyChanged(e){let t=this.policyEdit;if(t&&e){if(t.title!==e.title)return!0;let i=JSON.stringify(t.expression),s=JSON.stringify(e.expression);return i!==s}return!0}isPolicyValid(){let e=!0;if(this.isPolicyEmpty()||this.isOnlyASingleGroup())return!1;let t=i=>{for(let s of i)if(s.children)t(s.children);else{let a=!s.value||!s.value?.toString()?.trim(),o=s.invalidAttribute||s.invalidAttributeValue,n=!s.operator||s.entity===We.Attribute&&!s.attr;if(a||o||n){e=!1;break}}};return t(this.policy.value),e}isPolicyEmpty(){return!this.policy.value||this.policy.value.length==0}isOnlyASingleGroup(){if(this.policy.value&&this.policy.value.length==1&&this.policy.value[0].match)return!0}validateAttributes(){let e=this.attributes,t=a=>!a.attr||u.containsByProperty(e,"name",a.attr.name),i=a=>{let n=u.itemByProperty(e,"name",a.attr.name).values;return n&&n.length?!a.value||u.containsByProperty(n,"val",a.value):!0},s=a=>{for(let o of a)o.children?s(o.children):o.attr&&(t(o)?i(o)||(o.invalidAttributeValue=!0):o.invalidAttribute=!0)};s(this.policy.value)}extendAttributes(){this.attributes=this.attributes.map(e=>te(D({},e),{hasValues:!!(e.values&&e.values.length)}))}createTestOptions(){let e={},t={},i={},s=o=>{for(let n of o)if(n.children)s(n.children);else{let r=n.entity,l=n.value;if(r==We.Attribute){let c=n.attr;e[c.name]=c}else r==We.Role?t[l]=l:r==We.Group&&(i[l]=l)}};return s(this.policy.value),{expInfo:pt.getServerSchema(this.policy),attributes:e,groups:i,roles:t}}createNewPolicy(){return{id:W.random(),name:"",match:Qa.All,value:[]}}isMaxEntries(){let e=0;for(let t of this.policy.value)t.children&&t.children.length?e+=t.children.length:e++;return e>=this.maxEntriesPerPolicy}setupSources(){let e=this;this.roleSource=new st(t=>e.commonDataService.searchEntity(we.Role,t),t=>u.sortByProperty(t,"label"),e.commonDataService).source,this.groupSource=new st(t=>e.commonDataService.searchEntity(we.DistributionGroup,t),t=>u.sortByProperty(t,"label"),e.commonDataService).source,this.autocompleteTemplate=Re.autocompleteEntity}showMessageInvalid(){this.showError("Invalid policy","One or more rules are invalid, or have an empty value.")}showMessageInvalidEmpty(){this.showError("Invalid policy","There are no rules in this policy. Please add a rule.")}showMessageInvalidOneGroup(){this.showError("Invalid policy","Invalid group. Move rules to top level.")}showMessageUnchanged(){this.showMessage("No changes detected","No changes that requires saving were detected.")}},xs.ctorParameters=()=>[{type:b},{type:xe},{type:O},{type:y},{type:w}],xs.propDecorators={policyView:[{type:f,args:["policyViewRef",{read:A,static:!1}]}]},xs);wt=d([p({template:_l,styles:[Zl]})],wt);var Ka,Xa=(Ka=class{ngOnInit(){let e=this.entry.invalidAttribute,t=e?"user property":"user property value";this.removedText=`The previously selected ${t} has been removed:`,this.selectNewText=`Please select a new ${t}, or remove the rule.`,e&&(this.operatorLabel=u.itemByProperty(this.operators,"value",this.entry.operator).label),this.isAttribute=e}},Ka.propDecorators={entry:[{type:h}],operators:[{type:h}]},Ka);Xa=d([p({selector:"lm-invalid-policy-attribute",template:`
		<button
			soho-button="icon"
			icon="alert"
			extraIconClass="icon-alert"
			soho-tooltip
			trigger="click"
			placement="left"
			[popover]="true"
			[content]="'#lm-a-sp-attribute-error' + entry.id"></button>
		<div [id]="'lm-a-sp-attribute-error' + entry.id" class="hidden">
			<fieldset>
				<legend>
					<svg soho-icon icon="alert" [alert]="true"></svg>
					Invalid rule
				</legend>
				<div class="summary-form">
					<small>{{ removedText }}</small>
					<ng-container *ngIf="isAttribute">
						<div class="field lm-margin-xl-t">
							<span class="label">User property</span>
							<span class="data">{{ entry.attr.name }}</span>
						</div>
						<div>
							<span class="label">Condition</span>
							<span class="data">{{ operatorLabel }}</span>
						</div>
					</ng-container>

					<div class="field" [class.lm-margin-xl-t]="!isAttribute">
						<span class="label">Value</span>
						<span class="data">{{ entry.value }}</span>
					</div>
					<small>{{ selectNewText }}</small>
				</div>
			</fieldset>
		</div>
	`,styles:[jl]})],Xa);var Hl=m=>e=>!m.some(t=>t.value.expressionId===e.value.expressionId),Kc=(m,e=0)=>t=>t.pipe(ar(m),bt(i=>i.length>e)),em=()=>m=>m.pipe(bt(e=>!!e),an(),nn(e=>e.expressionId),Kc(100)),Ss,di=(Ss=class extends R{constructor(e,t,i,s,a,o,n,r,l){super("DynamicPermissionsComponent",n),this.adminService=e,this.sohoDialogService=t,this.pageService=i,this.element=s,this.storageService=a,this.ngZone=o,this.viewRef=r,this.selected=[],this.showRecent=!0,this.operator="||",this.showOperator=!1,this.selectedChange=new V,this.selectedLabel="",this.query="",this.hasSelection=!1,this.items=[],this.recentItems=[],this.idAttr={name:"id",value:"lm-a-ssp-s"},this.pageAccess$=this.pageService.pageAccess,this.invalidPageAccessIds$=this.pageAccess$.pipe(bt(c=>!!c),N(c=>c.filter(g=>g.ec).map(g=>g.exid))),this.unchekedIds$=je(this.selectedChange.asObservable(),this.pageAccess$).pipe(bt(([c])=>!!c),N(([c,g])=>g?c.filter(P=>!g.map(z=>z.exid).includes(P.expressionId)):c)),this.checkedInvalidIds$=this.unchekedIds$.pipe(em(),la(c=>this.validatePolicies(c)),ra((c,g)=>[...c,...g],[]),lr([]),nr()),this.invalidSelections$=je(this.selectedChange.asObservable(),this.invalidPageAccessIds$,this.checkedInvalidIds$).pipe(N(([c,g,P])=>this.getInvalidSelection(c,[...g,...P]))),this.missingSelections$=this.selectedChange.pipe(N(c=>this.getMissingSelection(c))),this.brokenPoliciesMessage$=je(this.invalidSelections$,this.missingSelections$).pipe(N(([c,g])=>c&&c.length||g&&g.length?this.getBrokenPoliciesMessage(c,g):null)),this.maxPolicies=I.MaxPolicies,this.pageSize=15,this.maxRecentItems=5,this.searchQueryChanged=new Ee,this.accessTitles=this.pageService.getAccessTitles(),this.getInvalidSelection=(c,g)=>this.getBrokenSelection(c,P=>g.includes(P.expressionId)),this.getMissingSelection=c=>this.getBrokenSelection(c,g=>!this.accessTitles[g.expressionId]),this.getBrokenSelection=(c,g)=>{if(c){let P=c.filter(z=>g(z));return P.length?P:null}else return null},this.isAdministrator$=l.tool$.pipe(N(c=>c.isAdministrator))}ngOnInit(){this.searchQueryChanged.pipe(na(500),ft(),la(e=>{this.query=e,this.paging=void 0,this.items=[],this.isBusy=!0;let t=this.createRequest(e);return this.adminService.listExpressions(t).pipe(rt(()=>this.isBusy=!1))})).subscribe(e=>{this.onPoliciesLoaded(e)})}ngAfterViewInit(){let e=this.selectedExpressions||[];e.length?(this.updatedSelectedItems(e),this.selectedChange.emit(e)):this.selectedExpressions=e,this.swapList.selectedItems=e.map(t=>this.toSwapListItem(t)),this.subscribeToListScroll(),this.showRecent?this.getRecentlyUsedAccesses().subscribe(t=>{this.recentItems=t.map(i=>this.toSwapListItem(i)),this.loadPolicies()}):this.loadPolicies(),this.operator!=="&&"&&(this.operator="||")}openExpressionEditor(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=pt.getEditorTitle(e),s=this.sohoDialogService.modal(wt,this.viewRef).id("lm-a-dp-editpolicy-dialog").title(i).suppressEnterKey(!0).afterClose(a=>{this.isDialogOpen=!1;let o=a?a.value:null;o&&(t?this.onExpressionEdited(o):this.onExpressionAdded(o))});s.apply(a=>{a.modalDialog=s,a.mode=e,a.policyEdit=t}).open()}onAdd(){this.openExpressionEditor(Se.Add)}onEdit(){this.openExistingPolicy(Se.Edit)}onView(){this.openExistingPolicy(Se.View)}openExistingPolicy(e){this.isBusy||this.isDialogOpen||(this.isBusy=!0,this.adminService.getExpression({content:this.editInfo.expressionId}).pipe(rt(()=>this.isBusy=!1)).subscribe(t=>{this.openExpressionEditor(e,t.content)},t=>{this.adminService.handleError(t)}))}onBeforeSwap(){this.isSwapping=!0}onSwapUpdate(){this.isSwapping=!1;let e=this.getSwapListData();this.updateSwapList(e),this.setItemsDivider(e.recentItemsLength),this.emitSelectionChange(e.selected)}onOperatorChange(){this.updatedSelectedItems(this.selectedExpressions)}getSwapListData(){let e=this.isMax(),t=this.swapList.selectedItems;e&&(t=t.slice(0,this.maxPolicies));let i=this.recentItems.filter(Hl(t));this.query&&(i=i.filter(a=>a.text.toLowerCase().indexOf(this.query.toLowerCase())>=0)),e&&(i=i.map(a=>te(D({},a),{disabled:!0})));let s=this.items.map(a=>this.toSwapListItem(a)).filter(Hl([...t,...i]));return{available:[...i,...s],selected:t,recentItemsLength:i.length}}attachListClickHandler(){let e=this.getSwapListData(),t=$(this.element.nativeElement).find("li");t.off("click").click(i=>{t.hasClass("is-selected")?this.editInfo=null:this.setEditInfo(i,e)})}clearSearch(){this.query="",this.loadPolicies(!0)}onSearch(e){this.searchQueryChanged.next(e)}setEditInfo(e,t){let i=$(e.currentTarget),s=i.index(),a=i.closest("soho-swaplist-card").attr("type")==="selected",o=a?t.selected[s]:t.available[s];o&&(this.editInfo={expressionId:o.value.expressionId,inSelectedList:a,index:s})}emitSelectionChange(e){let t=e.map(i=>i.value);this.updatedSelectedItems(t),this.ngZone.run(()=>this.selectedChange.next(t.length?t:null))}loadPolicies(e,t){this.isBusy=!0,e&&(this.paging=void 0,this.items=[]);let i=this.createRequest(t);this.adminService.listExpressions(i).pipe(rt(()=>this.isBusy=!1)).subscribe(s=>this.onPoliciesLoaded(s))}subscribeToListScroll(){let e=this.element.nativeElement.querySelector(".listview");on(e,"scroll").pipe(na(100),bt(()=>this.hasMore&&!this.isSwapping),N(()=>this.isScrolledBottom(e)),bt(Boolean),rr(ir(100))).subscribe(()=>{this.loadPolicies(!1,this.query)})}setItemsDivider(e){e&&this.element.nativeElement.querySelector(`li:nth-child(${e})`).classList.add("recent-expression-border")}isScrolledBottom(e){return e.scrollTop+e.offsetHeight+150>=e.scrollHeight}toSwapListItem(e){return{id:W.random(4),value:e,text:e.title,disabled:this.isMax()}}isMax(){let e=this.swapList.selectedItems;return e&&e.length>=this.maxPolicies}onExpressionAdded(e){if(!this.isMax()){let t=this.swapList.selectedItems;t.push(this.toSwapListItem(e)),this.updateSwapList({available:this.swapList.availableItems,selected:t}),this.emitSelectionChange(t)}this.loadPolicies(!0)}onExpressionEdited(e){this.editInfo.inSelectedList&&(this.swapList.selectedItems=this.swapList.selectedItems.map(t),this.emitSelectionChange(this.swapList.selectedItems)),this.recentItems=this.recentItems.map(t);function t(i){return i.value.expressionId===e.expressionId&&(i.text=e.title,i.value.title=e.title),i}this.editInfo=null,this.loadPolicies(!0)}onPoliciesLoaded(e){this.paging=e.paging,this.hasMore=!e.paging.standardEnd,this.items=this.items.concat(e.content);let t=this.getSwapListData();this.updateSwapList(t),this.setItemsDivider(t.recentItemsLength)}updateSwapList(e){this.swapList.updateDataset({available:e.available,selected:e.selected}),this.editInfo=null,this.attachListClickHandler()}createRequest(e){let t=e?{query:e,paging:this.paging}:{paging:this.paging};return te(D({},t),{pageSize:this.pageSize})}updatedSelectedItems(e){this.selectedExpressions=e;let t=this.accessTitles;for(let i of e)this.isMissing(i)?delete t[i.expressionId]:t[i.expressionId]=i.title,i.operator=this.operator||"||"}getRecentlyUsedAccesses(){let e=this.storageService.getLocalStorageItem(this.pageService.recentAccessesStorageKey)||[],t=this.accessTitles;return this.pageService.pageAccess.pipe(he(1),N(i=>i?e.filter(s=>i.some(a=>a.exid===s)).map(s=>({title:t[s],expressionId:s})).slice(0,this.maxRecentItems):[]))}validatePolicies(e){return this.adminService.validateExpressions(e.map(t=>t.expressionId)).pipe(N(t=>t&&t.content?t.content:[]))}getBrokenPoliciesMessage(e,t){let i=M.policyMissingOrInvalidText;if(!l(e)&&!l(t))return o();if(!l(e)&&l(t))return c(e)?n():r();if(l(e)&&!l(t))return c(t)?s():a();return null;function s(){return{header:"Missing policy",message:`There is a policy that is selected that is missing. Look for 'Missing policy' and remove it. ${i}`}}function a(){return{header:"Missing policies",message:`There are ${t.length} selected policies that are missing. Look for 'Missing policy' and remove them. ${i}`}}function o(){return{header:"Missing and invalid policies",message:`There are issues with ${e.length+t.length} selected policies. Please review all
					selected policies. ${i}`,invalidTitles:e.map(g=>oe.escapeStringForHtml(g.title))}}function n(){return{header:"Invalid policy",message:`The selected policy '${oe.escapeStringForHtml(e[0].title)}' is invalid. It may have rules with a user property that does not exist. Please review it.`}}function r(){return{header:"Invalid policies",message:`There are issues with ${e.length} selected security policies. Please review all selected policies. ${i}`,invalidTitles:e.map(P=>oe.escapeStringForHtml(P.title))}}function l(g){return!g||!g.length}function c(g){return g&&g.length===1}}isMissing(e){return e&&e.title===x.missingPolicyText&&!e.expression}},Ss.ctorParameters=()=>[{type:y},{type:w},{type:F},{type:Ci},{type:lt},{type:B},{type:b},{type:A},{type:O}],Ss.propDecorators={swapList:[{type:f,args:[Cr,{static:!1}]}],listLabel:[{type:h}],selected:[{type:h}],selectedExpressions:[{type:h}],showRecent:[{type:h}],operator:[{type:h}],showOperator:[{type:h}],selectedChange:[{type:U}]},Ss);di=d([p({selector:"lm-dynamic-permissions",template:Gl,styles:[Vl]})],di);var Cs,ot=(Cs=class extends R{get operator(){return this._operator}set operator(e){this._operator=e==="&&"?e:"||"}constructor(e){super("DynamicPermissionsDialogComponent",e),this.searchVisible=!0,this.showRecent=!0,this.showOperator=!0,this.isRequired=!1,this.isEditable=!0,this._operator="||"}ngOnInit(){this.modalDialog.afterOpen(()=>{this.permissionsComponent.attachListClickHandler()})}save(){this.isEditable&&this.modalDialog.close({value:this.selected,operator:this.permissionsComponent.operator})}onSelected(e){this.selected=e}},Cs.ctorParameters=()=>[{type:b}],Cs.propDecorators={permissionsComponent:[{type:f,args:[di,{static:!1}]}]},Cs);ot=d([p({template:Wl})],ot);var to,eo=(to=class{constructor(){this.settingsForm=new ln({title:new Ye("",yt.required),description:new Ye("",yt.required),color:new Ye(le.numberToHexCode(0)),enableMemo:new Ye(!1),memoDuration:new Ye(0),enableAnimation:new Ye(!0)}),this.pageTitleMaxLength=I.pageTitleLength,this.pageDescriptionMaxLength=I.pageDescriptionLength,this.availableColors=le.getPageColorPickerOptions().colors,this.allowedMemoDuration=I.allowedMemoDuration,this.valueChanges=this.settingsForm.valueChanges.pipe(N(e=>{let t=e.color,i=t&&t.indexOf("#")===0?t:this.colorpicker.getHexValue();return{t:e.title,d:e.description,cl:le.hexCodeToNumber(i),em:Number(e.enableMemo),md:Number(e.memoDuration),dma:+!e.enableAnimation}}),bt(()=>this.settingsForm.valid)),this.validated=this.settingsForm.statusChanges.pipe(N(e=>e==="VALID"))}ngAfterViewInit(){this.showDescription||this.settingsForm.setControl("description",new Ye("",yt.nullValidator));let e=this.settings;e&&this.settingsForm.patchValue({title:e.t,description:e.d,color:le.numberToHexCode(e.cl),enableMemo:!!e.em,memoDuration:e.md||0,enableAnimation:e.dma!==1})}formatMemoDuration(e){return e===0?"Off":`${e}`}},to.propDecorators={colorpicker:[{type:f,args:[Et,{static:!1}]}],valueChanges:[{type:U}],validated:[{type:U}],settings:[{type:h}],showDescription:[{type:h}]},to);eo=d([p({selector:"lm-dynamic-page-settings-basic",template:Bl,styles:[Ul]})],eo);var Is,At=(Is=class extends hn{constructor(e,t,i,s){super("DynamicPageSettingsDialog",s),this.dynamicPageService=e,this.dialogService=t,this.adminService=i,this.isEnabled=!0}ngOnInit(){this.isDefault=this.isCreatePage||this.isEdit&&!x.hasAccess(this.settings),this.initModalDialog();let e=this.editInfo;e&&e.openPermissions&&this.openPermissionsDialog(),this.setEditedSetting(this.settings),this.setOptionsItems()}onTabChange(){let e=this.getTranslationItemIndex("t");if(e<0||!this.optionsItems)this.setOptionsItems();else{this.optionsItems[e].defaultValue=this.editedSetting.t;let t=this.getTranslationItemIndex("d");this.isDefault&&t>-1&&(this.optionsItems[t].defaultValue=this.editedSetting.d)}}setOptionsItems(){this.optionsItems=[],this.optionsItems.push({name:"t",label:"Title",labelId:"lm-a-dps-at-t-lbl",valueId:"lm-a-dps-at-t-inp",isRequired:!0,maxLength:I.pageTitleLength,defaultValue:this.editedSetting.t}),this.isDefault&&this.optionsItems.push({name:"d",label:"Description",labelId:"lm-a-dps-at-d-lbl",valueId:"lm-a-dps-at-d-inp",isRequired:!0,maxLength:I.pageDescriptionLength,defaultValue:this.editedSetting.d})}getAccessText(){return x.expAccessText(this.expressions)}onLocalizationChange(e){this.containerLznEdited=e||{}}setEditedSetting(e){this.editedSetting=D(D(D({},this.settings),this.editedSetting),e)}saveDisabled(){return!((this.isCreate||this.expressionValid()||this.isDefault)&&this.settingsAreValid)}openPermissionsDialog(){if(this.isPermissionsOpen)return;this.isPermissionsOpen=!0;let e=this.dialogService.modal(ot,this.viewRef).id("dyn-settings-perm-mdl").title("Select Security Policy").afterClose(t=>{if(this.isPermissionsOpen=!1,t&&t.value){let i=t.value,s=t.operator;this.editedSetting=te(D(D({},this.settings),this.editedSetting),{as:1,ais:x.toIds(i),op:s}),this.expressions=i}});e.apply(t=>{t.modalDialog=e,t.listLabel="Choose which set of users this configuration should be applied to.",t.selectedExpressions=this.expressions,t.isRequired=!0,t.showOperator=!0,t.operator=(this.editedSetting||this.editInfo.setting).op}).open()}save(){if(!this.isEnabled)return;let e=v.copy(this.editedSetting);if(!new vn().validate(e)){this.setCanClose(!1);return}e.em||(e.md=0,e.dma=0),!(this.isSaved&&!this.hasSubmitError)&&(this.isSaved=!0,e.lzn=this.containerLznEdited?this.containerLznEdited:null,this.isCreate?this.submitSafe(this.dynamicPageService.createPage(e.t,e.d,e.cl,e.lzn,e.em,e.md,e.dma)).subscribe():this.isEdit?this.submitSafe(this.dynamicPageService.updateSetting(e,this.settings)).subscribe():this.submitSafe(this.dynamicPageService.addSetting(e)).subscribe())}hasInvalidTranslation(e){return!1}deleteTranslation(e){}expressionValid(){return!!this.settings&&x.hasAccess(this.settings)||!!this.editedSetting&&x.hasAccess(this.editedSetting)}},Is.ctorParameters=()=>[{type:F},{type:w},{type:y},{type:b}],Is.propDecorators={viewRef:[{type:f,args:["dynamicSettings",{read:A,static:!0}]}]},Is);At=d([p({template:Fl,styles:[zl]})],At);var ql=`<div>\r
	<p class="lm-margin-sm-b">\r
		The selected policies will be applied in the preview of the page.\r
	</p>\r
	<div>\r
		<div class="lm-margin-lg-t lm-margin-lg-b">\r
			<input\r
				soho-checkbox\r
				id="lm-a-dp-pv-a"\r
				type="checkbox"\r
				[(ngModel)]="isAllSelected"\r
				(ngModelChange)="onSelectAll($event)" />\r
			<label soho-label for="lm-a-dp-pv-a" [forCheckBox]="true"\r
				>Select / deselect all</label\r
			>\r
		</div>\r
		<div class="field" *ngFor="let item of items; let i = index">\r
			<input\r
				soho-checkbox\r
				type="checkbox"\r
				id="lm-a-dp-pv-{{ i }}"\r
				[(ngModel)]="item.selected" />\r
			<label soho-label for="lm-a-dp-pv-{{ i }}" [forCheckBox]="true">{{\r
				item.access.t\r
			}}</label>\r
		</div>\r
	</div>\r
</div>\r
`;var io,ci=(io=class{constructor(e){this.items=[],this.isAllSelected=!1;let t=e.getPage(),i=e.getAccessTitles();this.addItems(t.accs||[],i)}onSelectAll(e){for(let t of this.items)t.selected=e}getPreviewOptions(){let e={};for(let t of this.items)e[t.access.exid]=t.selected;return{results:e}}addItems(e,t){for(let i of e)i.t||(i.t=t[i.exid]),this.items.push({access:i,selected:!1})}},io.ctorParameters=()=>[{type:F}],io);ci=d([p({template:ql})],ci);var ws=class{constructor(e,t,i,s){this.viewContainerRef=e,this.dialogService=t,this.adminService=i,this.pageService=s}previewAsUser(e){let t=this.adminService.openUserSearchDialog("Preview as User",this.viewContainerRef,"Select a user to preview the page as","Recently previewed as",this.pageService.getRecentUserSearches());e=e||{},t.subscribe(i=>{i&&(this.pageService.addUserToRecentSearch(i),e.userInfo=i,this.pageService.preview(e))})}previewAsPolicy(){let e=this.dialogService.modal(ci,this.viewContainerRef).title("Preview using Security Policies").id("lm-dp-preview-policy-dialog").buttons([{text:"Cancel",id:"lm-dp-preview-policy-dialog-cancel",click:()=>e.close()},{text:"OK",id:"lm-dp-preview-policy-dialog-ok",isDefault:!0,click:()=>{e.close(),this.pageService.preview(e.componentDialog.getPreviewOptions())}}]).open()}};var Ql=`.permission-container{display:flex;flex-direction:column;border-top:1px solid;padding-top:20px;margin-bottom:10px}.permission-edit{display:flex;flex-direction:row;margin-top:5px}.permission-edit h2{flex:1 1 auto;font-weight:700;margin-top:5px;vertical-align:middle}.permission-edit svg{top:3px}
/*# sourceMappingURL=publish-dialog.css.map */
`;var Ps,As=(Ps=class extends J{constructor(e,t,i,s){super("DynamicPublishDialogComponent",e),this.dialogService=t,this.adminService=i,this.pageService=s,this.canPublish=!1,this.isRestricted=!1}ngOnInit(){this.initModalDialog(),this.loadPublishInfo()}publish(){let e=this.page,t=this.expressions;if(t&&t.length){e.accesses=[];for(let i of t)e.accesses.push({exid:i.expressionId,as:1})}else e.accesses=null;this.closeWithResult(C.Ok,e)}cancel(){this.setCanClose(!0),this.close()}clearPermission(){this.isRestricted=!1,this.expressions=null,this.updateAccessText()}updateAccessText(){let e=0,t=this.expressions&&this.expressions.length>0;t&&(e=this.expressions.length,u.sortByProperty(this.expressions,"title"));let i=t?this.expressions[0].title:null;this.accessText=x.accessText(i,e),this.accessTextTooltip=t?ue.join(this.expressions,s=>s.title,", "):x.allUsersText}openPermissionsDialog(){let e=this.dialogService.modal(ot,this.view).id("dyn-publ-mdl").title("Select Security Policy").afterClose(t=>{if(t&&t.value){let i=t.value;this.expressions=i,this.isRestricted=!!i,this.updateAccessText()}});e.apply(t=>{t.modalDialog=e,t.listLabel="Choose which security policy that should restrict access to this page.",t.selectedExpressions=this.expressions,t.isRequired=!0,t.showRecent=!1,t.showOperator=!1}).open()}loadPublishInfo(){this.submitSafe(this.pageService.getPublishInfo(this.page.pageId),!1,!0).subscribe(e=>{this.onLoadPublishInfo(e)})}onLoadPublishInfo(e){let t=e.content;this.page=t;let i=t.accesses;if(i){this.expressions=[];for(let s of i){let a={expressionId:s.exid,title:s.t};this.expressions.push(a)}}this.isRestricted=!!this.page.accesses,this.canPublish=!0,this.updateAccessText()}},Ps.ctorParameters=()=>[{type:b},{type:w},{type:y},{type:F}],Ps.propDecorators={view:[{type:f,args:["dynamicPublishView",{read:A,static:!1}]}]},Ps);As=d([p({template:`
		<div
			soho-busyindicator
			[transparentOverlay]="false"
			[blockUI]="true"
			[displayDelay]="0"
			[activated]="isBusy">
			<div #dynamicPublishView class="permission-container lm-brd">
				<p class="lm-margin-lg-b">
					{{
						isRestricted
							? "This page will be available for users within the selected security policy."
							: "This page will be available for all users."
					}}
				</p>

				<div class="permission-edit">
					<h2 [title]="accessTextTooltip" soho-tooltip>
						<svg soho-icon [icon]="isRestricted ? 'locked' : 'url'"></svg
						>{{ accessText }}
					</h2>
					<button
						soho-button="tertiary"
						icon="edit"
						id="lm-a-dp-publish-edit"
						(click)="openPermissionsDialog()">
						Edit
					</button>
					<button
						*ngIf="isRestricted"
						soho-button="tertiary"
						icon="delete"
						id="lm-a-dp-publish-cancel"
						(click)="clearPermission()">
						Clear
					</button>
				</div>
			</div>
		</div>

		<div class="modal-buttonset">
			<button
				type="button"
				class="btn-modal"
				id="lm-a-dp-publish-cancel"
				(click)="cancel()">
				Cancel
			</button>
			<button
				type="button"
				class="btn-modal-primary"
				[disabled]="!canPublish"
				id="lm-a-dp-publish-ok"
				(click)="publish()">
				Publish
			</button>
		</div>
	`,styles:[Ql]})],As);var Ds,so=(Ds=class extends q{set expressionFilter(e){if(!this.isValidExpressionFilter(e)){this.logInfo("Ignoring Expression filter change");return}e!=null&&this.logInfo("Expression filter set to "+e.expressionId),this._expressionFilter=e,e==null||!e.title?this.expressionFilterTitle=null:this.expressionFilterTitle=e.title,this.isInitialized&&this.clearAllFiltersOptional(!1)}get expressionFilter(){return this._expressionFilter}constructor(e,t,i,s,a,o,n,r,l){super("AdminDynamicPagesComponent","page",e,t,i,s,a,{isFilter:!0,isOwnerFilter:!1,isOtherUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Checked out",propertyName:"lock",value:9,type:H.Custom},{name:"Checked out by...",propertyName:"checkedOutId",isUser:!0,type:H.Custom},{name:"Draft",propertyName:"state",value:Me.Draft,type:H.Custom},{name:"Published",propertyName:"state",value:Me.Published,type:H.Custom},{name:"Published (Edited)",propertyName:"state",value:Me.PublishedEdited,type:H.Custom}]}),this.dynamicPageService=o,this.viewContainerRef=n,this.dialogService=r,this.adminContext=l,this.expressionFilterTitle="",this.editedPage=this.dynamicPageService.editedPage,this._expressionFilter=null,this.isInitialized=!1,this.editorSubscription=o.editorToggled.subscribe(c=>{this.onEditorToggled(c)}),this.restoredUnsubscriber=i.onArchiveRestored().on(()=>{this.refresh()}),this.initGrid()}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId,this.isReadOnly=E.isReadOnlyUser(e)),this.refresh(),this.isInitialized=!0}ngOnDestroy(){this.editorSubscription.unsubscribe(),this.restoredUnsubscriber()}isValidExpressionFilter(e){return e&&(e.filterTarget===He.All||e.filterTarget===He.DynamicPages)}getDataGrid(){return this.dataGrid}getTitle(){let e=this.selected;return e&&e.lock===1&&e.changedBy!==this.currentUser?"This page has been checked out by another user":"Actions"}addPage(){if(this.isAddOpen)return;this.isAddOpen=!0,this.logDebug("Adding page");let e=this.sohoDialogService.modal(At,this.viewContainerRef).id("dyn-p-settings-mdl").title("Page Settings").afterClose(()=>{this.isAddOpen=!1});e.apply(t=>{t.modalDialog=e,t.isCreate=!0,t.isCreatePage=!0}),e.open()}checkOutPage(e,t){if(t){let i="Confirm force check out",s="Are you sure that you want to force check out of the page '"+e.title+"' that is currently checked out by '"+e.changedByName+"'?";this.showConfirm(i,s).subscribe(()=>{this.checkOutInternal(e,!0)});return}this.checkOutInternal(e)}checkInPage(e){this.logDebug(`Checking in page ${e.pageId}`);let t="Check in",i=this.dynamicPageService.checkInPage(e.pageId);this.withBusy(i).subscribe(s=>{this.updateSelected(s.content),this.showToast(t,`'${e.title}' was checked in.`)},s=>{this.handleError(t,"Unable to check in page.",s)})}editPage(e){this.logDebug(`Editing page ${e.pageId}`),this.dynamicPageService.editPage(e.pageId).pipe(G(()=>Y())).subscribe()}viewPage(e){this.logDebug(`View page ${e.pageId}`),this.dynamicPageService.viewPage(e.pageId).pipe(G(()=>Y())).subscribe()}publishPage(e){let t=this.sohoDialogService.modal(As,this.viewContainerRef).title("Publish Dynamic Page").id("lm-a-dp-publish-dialog").afterClose(i=>{i&&this.executePublish(i.value)});t.apply(i=>{i.modalDialog=t,i.page=e}).open()}importPageLocalization(e){let t="Import Translation",i=this.importOptions(t);i.content="language";let s=`This import will replace language translations for '${e.title}'. Are you sure you want to continue?`;this.showConfirm(t,s).subscribe(()=>{this.openImportDialog(i,e)})}openImportPageDialog(e){let t=e&&e.pageId,i="Import Page"+(t?" As Replacement":" As New"),s=this.importOptions(i),a=t?"Import as replacement":null,o=t?`This import will replace '${e.title}'. Are you sure you want to continue?`:null;t?this.showConfirm(a,o).subscribe(()=>{this.openImportDialog(s,e)}):this.openImportDialog(s,e)}exportPage(e){this.dynamicPageService.exportPage(e.title,e.pageId,!1)}exportPageLocalization(e){let t=this.sohoDialogService.modal(ts,this.viewContainerRef).title("Export Translation").id("lm-a-dp-exporttranslation-dialog").afterClose(i=>{if(i){let s=ue.join(i,a=>a.tag);this.dynamicPageService.exportPageLocalization(e.title,e.pageId,s)}});t.apply(i=>{i.dialog=t,i.description="Select the languages that you want to export for translation."}).open()}onClickDiscard(e){let t="Confirm Discard",i=`Are you sure that you want to discard all changes to the page '${e.title}'?`;this.showConfirm(t,i).subscribe(()=>{let s=e.pageId;this.logDebug(`Deleting draft page ${s}`);let a=this.dynamicPageService.deleteDraftPage(s);this.withBusy(a).subscribe(o=>{let n=this.getUpdatedPageList(o.content);this.updateItems(n)},o=>{this.handleError("Discard","Unable to discard page changes.",o)})})}onClickDelete(e){let t="Confirm Delete",i=`Are you sure that you want to delete the page '${e.title}'?`;this.showConfirm(t,i).subscribe(()=>{this.deletePage(e)})}listItems(e){let t=this.createRequest(e);if(!t)return;this._expressionFilter!=null&&(t.expressionId=this._expressionFilter.expressionId);let i=this.dynamicPageService.listPages(t);this.withBusy(i).subscribe(s=>{this.addItems(s.content,s.paging),this.updateCount(s.count,s.maxCountAllowed)},s=>{this.onError(s)})}openCreateArchiveDialog(e){if(this.logDebug("Archiving a page"),e.state!==Me.Published){this.showError("Archive Page","Page needs to be published to be archived.");return}let t=e.pageId,i=e.title,s=this.sohoDialogService.modal(ms,this.viewContainerRef).title("Archive Page").id("dyn-p-archive-mdl");s.apply(a=>{a.modalDialog=s,a.baseUrl="/admin/dynamic/page",a.entityId=t,a.entityTitle=i}).open()}openEntityArchiveDialog(e){let t=this.sohoDialogService.modal(bs,this.viewContainerRef).title(`Archive for Page '${oe.escapeStringForHtml(e.title)}'`).id("lm-a-dp-rst-selectarc-dialog").afterClose(i=>{i&&this.refresh()});t.apply(i=>{i.dialog=t,i.entityId=e.pageId}).open()}onClickClearPolicyFilter(){this.clearExpressionFilter(),this.clearAllFilters()}clearExpressionFilter(){this._expressionFilter=null}preview(e){let t=this.getPreviewOptions(e);this.dynamicPageService.preview(t)}previewAsUser(e){let t=this.getPreviewOptions(e);this.getPreviewer().previewAsUser(t)}initGrid(){let e=this.defaultOptions();e.selectable="single",e.expandableRow=!1,this.datagridOptions=e}getColumns(){return[this.getSelectionColumn(),{width:205,id:"adm-dp-col-t",field:"title",name:"Title",sortable:!1,resizable:!0},{width:304,id:"adm-dp-col-d",field:"description",name:"Description",sortable:!1,resizable:!0},{width:200,id:"adm-dp-col-cd",field:"changeDate",name:"Change date",sortable:!1,resizable:!0,formatter:S.date},{width:173,id:"adm-dp-col-cbn",field:"changedByName",name:"Changed by",sortable:!1,resizable:!0,formatter:S.displayName},{width:173,id:"adm-dp-col-lbn",field:"",name:"Checked out by",sortable:!1,resizable:!0,formatter:(e,t,i,s)=>{let a=this.items[e];return a&&a.lock===1?S.displayName(null,null,a.changedByName,null):""}},{width:140,id:"adm-dp-col-s",field:"state",name:"Status",sortable:!1,resizable:!0,formatter:S.dynamicPageStatus}]}getEmptyMessage(){return"No dynamic pages found"}clearCustomFilter(){this.clearExpressionFilter()}getPreviewer(){return new ws(this.viewContainerRef,this.sohoDialogService,this.adminService,this.dynamicPageService)}getPreviewOptions(e){return{pageId:e.pageId,isDraft:!0}}onEditorToggled(e){e||this.refresh()}deletePage(e){let t=e.pageId;this.logDebug(`Deleting page ${t}`),this.setBusy(!0),this.dynamicPageService.deletePage(t).subscribe(()=>{this.setBusy(!1),this.refresh()},i=>{this.setBusy(!1),this.handleError("Delete","Unable to delete page.",i)})}checkOutInternal(e,t){this.logDebug(`Checking out page ${e.pageId}`);let i="Check out",s=this.dynamicPageService.checkOutPage(e.pageId,t);this.withBusy(s).subscribe(a=>{this.updateSelected(a.content);let o=t?`'${e.title}' was forcibly checked out.`:`'${e.title}' was checked out.`;this.showToast(i,o)},a=>{let o=t?"Unable to forcibly check out page.":"Unable to check out page.";this.handleError(i,o,a)})}updateSelected(e){this.setBusy(!1);let t=this.getIndex(e);t<0||(this.items[t]=e,this.dataGrid.updateRow(t,e),this.dataGrid.selectRow(t))}executePublish(e){let t=e.pageId;this.logDebug(`Publishing page ${t}`);let i=null;e.accesses&&(i=e.accesses);let s={pid:t,accs:i},a=this.dynamicPageService.publishPage(s);this.withBusy(a).pipe(G(()=>Y())).subscribe(o=>{let n=o.content,r=this.getUpdatedPageList(n);this.updateItems(r),this.showToast("Page published",`'${n.title}' was published to the catalog.`)})}importOptions(e){return{url:"/admin",title:e,operation:"importdynamic",buttonText:"Import",acceptFileExtension:".zip"}}openImportDialog(e,t){let i=this.sohoDialogService.modal(Or,this.viewContainerRef).title(e.title).id("lm-a-dp-import-dialog").afterClose(s=>{s&&s.value.responseCode===Q.Success&&setTimeout(()=>{t&&t.pageId?(this.logDebug("Importing as replacement"),this.startImport(t.pageId,e.content)):(this.logDebug("Importing as new"),this.startImport())},0)});i.apply(s=>{s.dialog=i,s.options=e}).open()}startImport(e,t){let i=this.sohoDialogService.modal(Ft,this.viewContainerRef).title("Importing").id("lm-a-dp-import-result-dialog").afterClose(s=>{this.refresh()});i.apply(s=>{s.modalDialog=i,e!==null?s.pageId=e:s.pageId=null,s.operation="import"}).open()}showToast(e,t){this.dialogService.showToast({title:e,message:t})}getUpdatedPageList(e){return this.items.map(t=>t.pageId===e.pageId?e:t)}getIndex(e){let t=this.items;for(let i=0;i<t.length;i++)if(t[i].pageId===e.pageId)return i;return-1}handleError(e,t,i){i&&i.hasError()&&!i.hasGenericError()?this.showError(e,`${i.getErrorMessages()}`):this.showError(e,t)}},Ds.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:F},{type:A},{type:$e},{type:O}],Ds.propDecorators={expressionFilter:[{type:h}],dataGrid:[{type:f,args:["dynamicPagesDatagrid",{static:!1}]}]},Ds);so=d([p({selector:"lm-admin-dynamic-pages",template:Nl})],so);var Jl=`<div class="components-wrapper">\r
	<div class="component-card lm-brd dyn-image">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<p>Image</p>\r
				<small>Display an image.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addimage-btn"\r
				icon="add"\r
				(click)="addImage()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-information">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info lm-position-r">\r
				<svg\r
					soho-icon\r
					class="dyn-experimental"\r
					icon="formula-constituents"\r
					soho-tooltip\r
					[content]="experimentalTooltip"></svg>\r
				<p>Information</p>\r
				<small\r
					>Display a photo, links, texts and other details in this customizable\r
					component.</small\r
				>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addinformation-btn"\r
				icon="add"\r
				(click)="addItems()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-links">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<p>Link list</p>\r
				<small>Display a list of links.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addlinks-btn"\r
				icon="add"\r
				(click)="addLinkList()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-shortcuts">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<p>Shortcuts</p>\r
				<small>Display shortcut links to your favorite websites.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addshortcuts-btn"\r
				icon="add"\r
				(click)="addLinkList(true)">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-text">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<svg\r
					soho-icon\r
					class="dyn-experimental"\r
					icon="formula-constituents"\r
					soho-tooltip\r
					[content]="experimentalTooltip"></svg>\r
				<p>Text</p>\r
				<small>Display a line of text or a paragraph.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addtext-btn"\r
				icon="add"\r
				(click)="addText()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-web">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<p>Web</p>\r
				<small>Display an embedded web page.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addweb-btn"\r
				icon="add"\r
				(click)="addWeb()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
\r
	<div class="component-card lm-brd dyn-widget">\r
		<div class="icon-wrapper">\r
			<svg></svg>\r
		</div>\r
		<div class="main-wrapper lm-item-bg">\r
			<div class="component-info">\r
				<p>Widget</p>\r
				<small>Display any Homepages widget.</small>\r
			</div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-dp-ac-addwidget-btn"\r
				icon="add"\r
				(click)="addWidget()">\r
				Add\r
			</button>\r
		</div>\r
	</div>\r
</div>\r
`;var Xl=`.components-wrapper{max-width:770px;display:flex;flex-wrap:wrap;justify-content:space-between}.component-card{height:120px;border:1px solid;border-radius:2px;flex:0 1 375px;display:flex}.component-card svg:not(.dyn-experimental){width:63px;height:63px;margin:auto;border-radius:3px}.component-card:not(:last-child){margin-bottom:25px}.icon-wrapper{flex:0 0 120px;display:flex}.dyn-image svg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDEzOjQwOjE0KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTA4VDEzOjQwOjE0KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0wOFQxMzo0MDoxNCswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiMmE4YmZkOC1lYzMzLWI1NDktYTc0MS0yY2JjNGQ5YTAxZmQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MGRlOGZiZC03NzMxLWI0NDYtODMzYy1hNmE1MWFlZGU1MzEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOWJjMTdlYS02Y2IyLWM4NDktYjkwNS04Y2VmYWRkNzE3MmMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowOWJjMTdlYS02Y2IyLWM4NDktYjkwNS04Y2VmYWRkNzE3MmMiIHN0RXZ0OndoZW49IjIwMTgtMTEtMDhUMTM6NDA6MTQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjJhOGJmZDgtZWMzMy1iNTQ5LWE3NDEtMmNiYzRkOWEwMWZkIiBzdEV2dDp3aGVuPSIyMDE4LTExLTA4VDEzOjQwOjE0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rgyuwAAAArxJREFUaIHtmk9IFFEcx38zozO7ltIfEzplEaLRpS5B3boJRWfLxEN57A9Elw5Rgl06BBFeg6joaCRGopCIoIH9xcpk26BU1PyzO3/fzHuvw9LuMv6f92afg/M57fvte9/fh+W94TGsZI7dgsgiixZgIrYXR7Tty3zjxOEbIGtCVNaHOPbE/eKC3x6UhCQnSie0Gagk+SrR3jmxvThie3HE9uKI7cUR24sj2vbLbmmbgDrfnjrjz4k1F2y9nKzW6pq0+gsA/uvXBglu73x9Yn16FHg5ABBrzvr4ECjRGlqCJQS3t8ef5T7IlQckRd30euLiTDqXI8Ce2gsAoFTVVja+CJaQfd2El1K5nGAwn1q5PPhaSWFtzrheLCWxp5h6ZhjBLE/MDYHS3db7BxRlymqOV5y4I1fUcAwP97fH82PmcDtFGQDwZkbN4dt888O1d6eGAGh+6M2M8t1C4drLyX3FQ0mtkhSeL4vCtVdrG8v2Hv0/kpLHrrE/JYsJ+dTK6s7TnSjdQ6zZ8v0nlT1H+MZztnenhpRddXKyulCSVfXQOb5dCtnckiixP3caA9f1/jai/+YWuyZ87Cla0geu2mOPAYDof7J9l/HixErTMlza5eFgjxe+Z9+0eNMj+Qq15/X+Nm/2Q6HiWea7jszLs+jnK/aOeVjtiTGp910ixrSvTl3DeHvFnRwEALz4Q+9tRakuim1zpN0cvks9i7FvDtZTS11j1a+wYwzeVA+eQekeIChfR+lu7++XHafuMbaG0J+YFKNU1/Iyyf7Se1uZbtcAUIJb2mpQjACj9eetyXa930uJ3VwMWHKC2yfqzgdeyysn+L7XGi6CJHN6nxMQllMrafXNWn0zQwIr2/XUbgVie3HE9uKI7cUR24sjthfHslsatimlK83cAhDHV/Db+/62tsWJ9s6J7cURbft/tpbyHVuEZN8AAAAASUVORK5CYII=)}.dyn-image .icon-wrapper{background-color:#f2bc41}.dyn-links svg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDEzOjQ5OjEzKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTA4VDEzOjQ5OjEzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0wOFQxMzo0OToxMyswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjQ1YmIyNi03MjNlLWQyNGUtODhkMS03YTRlZTZlODAwZWEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozYzEwNTRiZi1jY2U0LTdjNDEtYjA1MC02ZTY4ZWI1MGMxZTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZGI2NGI3OC1mMWQyLWI2NGEtYmZlOC0wZmQ0Mjg2MWMxODQiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZGI2NGI3OC1mMWQyLWI2NGEtYmZlOC0wZmQ0Mjg2MWMxODQiIHN0RXZ0OndoZW49IjIwMTgtMTEtMDhUMTM6NDk6MTMrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzY0NWJiMjYtNzIzZS1kMjRlLTg4ZDEtN2E0ZWU2ZTgwMGVhIiBzdEV2dDp3aGVuPSIyMDE4LTExLTA4VDEzOjQ5OjEzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wfgOnwAAAdhJREFUaIHtmjFPwkAYhnuFSSG2yKIYBjFEMDIYDDoYXWRx5V/i6lIXEgdtQhwwAUPEAUUTkbZSZJKeAwmRK8kdFfpdk3um400IT14K/Xot6r38SIFFhhb4F8IejmDbh4nXykYIIRATOhhL1vvob0LaIyQhbr8Phwy4NWVC2MNBHvduWvXXaqVhGQMlFsmfZlJ7Wz5oMULp/rnR0cq60e07I8fo9rVLvVXv+GPGAqX7aqXhSuqpbGK8vrt6WqDK0cXOvG+hdG/2bCKxjMG8n7E8KN2vqavmp00kk7WHthYLpfuDk11qAgil+3QuGQrLt9cPtjWMKivH5/upLEf/OYi4OlE3QzMnBYwxgh6AsCOZb1NzDuvZClx9JsE+17LaY4yX6uENpkmB218tpftmra2VddsaSpJkW0OtrDdrbV/EmKB0f3/z6E7SueR47WFSWOwJjtL9l/lNTQChdK+sR4yP/lQSi0zWvE8Kh2dZIsm7EkAo9tuZRLFUUONRWZbVeLRYKkzGYx5gnRR4wPukwCfCHg6xpwCH2FOAQ+wpwCH2FPxC7CnwhLCHQ9jDIezhEPZwCHs4hD0cwh6OYNuTV4YYz3iAihPcN/5Ie+KxNc4J9pEj7OEItv0vHVTJLNJDCo8AAAAASUVORK5CYII=)}.dyn-links .icon-wrapper{background-color:#c7b4db}.dyn-shortcuts svg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDEzOjU5OjI1KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTA4VDEzOjU5OjI1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0wOFQxMzo1OToyNSswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5YjhhMjhkMi1hOTZhLTEzNGItODM3YS01MjgzMzU3OTljMWYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZjg1OTQ5Zi0yOWUyLTEwNDctYTI4My1hZmQ1YjMyOTg4ZGMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MGQ2M2M0Ny05NTkxLTdiNGMtODE3MS00YTE5NjY5ZjQ1ZGMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MGQ2M2M0Ny05NTkxLTdiNGMtODE3MS00YTE5NjY5ZjQ1ZGMiIHN0RXZ0OndoZW49IjIwMTgtMTEtMDhUMTM6NTk6MjUrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWI4YTI4ZDItYTk2YS0xMzRiLTgzN2EtNTI4MzM1Nzk5YzFmIiBzdEV2dDp3aGVuPSIyMDE4LTExLTA4VDEzOjU5OjI1KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YYOCLgAAAgVJREFUaIHtmj9PwkAYh1tTkvInoIEBxR0H28FFjAuTC4PfwJ3Rz+AHcMQvgnMXI6x0kYVBQTtAFAK0CQ11MJrmjrS93vWuF+/ZesebPjnKvccvlY3Zm8Qte6wFsBD27ODbXgGuz/cPFVlmohKK63n9rw//CGivyLIip/YL2QLXqRWNhLBnh7BnB7jnRGG2XnZfTNMazx27pGa16nHrRCvnCnTK/cjAKe3y4Ch4xzStSadnOO7GP6gqmXajqVVroffDKXe97dPnu38E7cmZrpYPffDekiQ57qbTM6arZaLlMGj23eHA3oD3/jN4HJqJlsOg2ZvWJHB2nGg5DJr9wrEDZueBs/jlMGj2RTUbMFsKnMUvh0GzD94WTsM2DcxyGDT7Vl1XlczOKVXJtOp6ouUwaPaVfKHdaMIGPxt2JR/ScTDLYZC7lfTbLAfWeOHYRTWrx+q1McrhbhXHnhW4vTZtCHt2IJyQ7wfPUT52q18kUb4Tvtde7DnsEPbsEPbsYJCIEATZHog0ZuuVMRr2XkcRExGyUE1EiEM1ESEO1USEOFQTEeJQTUSIQzURIQ7VRIQ4VBMR4iB3K61au7u6xklECBLnpFDOFW7OEP6/JQffpzRhzw56iUgS/Ju1p7moEeF77YU9O/i2B3+1rufBL1ClBNfzgBHQHnhtLeXw/eQIe3bwbf8NUyQoP8BvmP0AAAAASUVORK5CYII=)}.dyn-shortcuts .icon-wrapper{background-color:#8ed1c6}.dyn-information svg:not(.dyn-experimental){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDE0OjAwOjE3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTA4VDE0OjAwOjE3KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0wOFQxNDowMDoxNyswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYTc1OTc0Yi00MDg3LTdkNDUtOWUzNi1iMzhmMTAzNzc2MjciIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2OWFjODcxNC05YjQ1LTdkNDktYWE2Mi1lMDIyMzk3MWRiMjYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNDcxZTBlYy04MDMzLWU5NDYtYjVjYy1jMTA3NmY0MWIzMmYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNDcxZTBlYy04MDMzLWU5NDYtYjVjYy1jMTA3NmY0MWIzMmYiIHN0RXZ0OndoZW49IjIwMTgtMTEtMDhUMTQ6MDA6MTcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmE3NTk3NGItNDA4Ny03ZDQ1LTllMzYtYjM4ZjEwMzc3NjI3IiBzdEV2dDp3aGVuPSIyMDE4LTExLTA4VDE0OjAwOjE3KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rpBApgAAAZ1JREFUaIFjrD78iWHIAqaBdgBFYNT1AweGtutZ0PglptzszIwD4hSC4Off/z2nvyKLoLueg5mRg2WQuh7TWUM75Yy6fuDAqOsHDgxt16OXmJjAvPsgHtmTpfbUcwzJYLiH/cCGLn4wtMN+aLue0lxLU0Aw0Q73sB/NtbQCo64fODBiXP/v/3/K7aOKIXBAuMxhYGDYe/P15IP3nn/8IcnPkWuv5KwuSoZNVDEEDRAO++3XXlZtuvb84w8GBobnH39Ubbq2/dpLUq2hiiGYgLDrF5x4RFCEPoZgAsIp5+mH77hEQhddwaVrdZwO1Q3BBITDXk6QC01EFkOEPoZgAsJhn2otX7HxGoqIlTyEQTBsqGsIJiAc9o5qoq1+WgrCXCxMjArCXK1+Wk6kFxdUMQQTEFViuqiLulBsGVUMQQMjpq4dhGDU9QMHRvu1AwdG+7UDB4a260dz7cCB0Vw7cGDU9QMHaFvm0DrPDPewHy1zaAVGXT9wYNT1AwfQy5wff6k6wE5V8PMvutPQXY+2bG2Qg6GdckZdP3BgaLseAJVaiy8aWAZ3AAAAAElFTkSuQmCC)}.dyn-information .icon-wrapper{background-color:#54a1d3}.dyn-widget svg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDE0OjAxOjA0KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTA4VDE0OjAxOjA0KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0wOFQxNDowMTowNCswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkMzQyOTNkMi0wOWQ3LTE3NDItOTI1NS0yZDQwYmI4YWQ2MWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZDU3NDk5OS1iYTlkLTMxNDMtOGJjYy1kOTYwOGIwYmFhNWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1NzQ3ZTA0ZS1iYTgyLTE3NDEtYjJiZC0zNDM0MDdmNDljNzIiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NzQ3ZTA0ZS1iYTgyLTE3NDEtYjJiZC0zNDM0MDdmNDljNzIiIHN0RXZ0OndoZW49IjIwMTgtMTEtMDhUMTQ6MDE6MDQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDM0MjkzZDItMDlkNy0xNzQyLTkyNTUtMmQ0MGJiOGFkNjFjIiBzdEV2dDp3aGVuPSIyMDE4LTExLTA4VDE0OjAxOjA0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SZEiBgAAAWVJREFUaIHtmrGOgkAQhncBE7l4xeET3AuQWFsZNeGpLHgtaW0oLPABfAMLJSfFCleQGLLbXP71Mkycr1o2mcmXyeyykNV1USi2BNQCXog9HbztI+v5Y7lUkT05Foz5ORyGE45oFOmx2nfODO/OEXs6xJ4OsadD7OkQezp42+MHsu7xuOz39enU3u9YhmA6naVpst3qMMQy4PaXoriWJRyulGqb5lqWejJJ1mssA945dVXBsUNuxyMci9f+2TDfux2W4ZznwzwA/75qz3neW7oDf951z/kjz75yB/68fe1f1cQAvGvP2/4FneO53/vAu/ZiT4fY0yH2dIg9Hbzt8ZNCEMf9R53nCz+IYzwWjpylKRw75HOxgGPx2iebjeq6uqrapsEy9P9zvlYr2AG312E4z7J5lsEZ/OG9asWeDrGnQ+zpEHs6xJ4O3vbOKc0Y9wLVWDDGmrDtrWtrI4d354g9HbztfwF5a1lXvMSXGAAAAABJRU5ErkJggg==)}.dyn-widget .icon-wrapper{background-color:#eb9d9d}.dyn-web svg{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJsGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDE2OjA2OjQxKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTExLTI4VDEzOjMwOjQ2KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0xMS0yOFQxMzozMDo0NiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjUyNGNkMWMtNDBjMy0xNTRlLWEyODQtZjJlMGE2NzgxZTY0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDQ4NDc1ZmUtMmYwNy1mNDQ3LWExZjYtZDY1ODhmMGRmOWRlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTgwOTA0YTctODFjOC1iYTRiLTljZDktMzE3M2Q2ZjQwY2FkIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjYzIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE4MDkwNGE3LTgxYzgtYmE0Yi05Y2Q5LTMxNzNkNmY0MGNhZCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0wOFQxNjowNjo0MSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNzA1NWU3Ny1lOGQwLTg3NDctOTI1Zi01MGI3OTRkY2QzZDYiIHN0RXZ0OndoZW49IjIwMTgtMTEtMjhUMTM6MzA6NDYrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjUyNGNkMWMtNDBjMy0xNTRlLWEyODQtZjJlMGE2NzgxZTY0IiBzdEV2dDp3aGVuPSIyMDE4LTExLTI4VDEzOjMwOjQ2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ3MDU1ZTc3LWU4ZDAtODc0Ny05MjVmLTUwYjc5NGRjZDNkNiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjUwZGU4ZmJkLTc3MzEtYjQ0Ni04MzNjLWE2YTUxYWVkZTUzMSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmE4MDkwNGE3LTgxYzgtYmE0Yi05Y2Q5LTMxNzNkNmY0MGNhZCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsdqumQAAAR2SURBVGiB7ZrvTxt1HMff37tre+2VltK1YOmEMTbocIIKbGOJhIhLZDxa5MkeQXjmE/8BE/fERz40WWLMIvGBiXFmMUEeOM3ARByCDiKl4NgGjpG1/Fqh7a69650PztV6hcnuSo4m93rUfvL5fj6vfvvtN9/7piScGkXJQhktoAvT3jhK255RvT/BnqEKgocECeJdfiI/ohalwVDkkNoTWR0p7ZVj2huHaW8cpr1xmPbGYdobR2nbF/lAFufX56ITS1uRteQjXkgCYC2cj6uu8YSaKs+42SPFbUdUz7WN7HltZ8xE+smte9cjsUmg4Cj4rFfI39Z1/F2nrVxDfQCSLM7zP+dHijP3i+sz3859mpXEXIQQQhMGQFYWZVn5PHIk9uv9zdmLoYF6b3NR+hZh3Yejt2+Er+arA5BlWZQEURKeqf9DWkzdmL0ajt7W3xf67Ze3IiPzQyrFvfBx1QBkWR6ZH1reiuhsDZ32vJgajlyTZWmf+a3B7ubAmwBkWRqOXOPFlJ7u0Gk/vjSczGzvP58QcuHE5dqKUwCSme3xpWE93aHHnhdT06tjLzTEywUIoXoa+i20FcD06pjO6de+5yzEpkRJ+N80C2076Xvdx1UH3fUvldUCcNrKWwKdkw9vipKwEJtS1pI2tM/9g625/aSdruq42DjQfvRCwFWXC75See6FiuyFdvvozjIAmnret2el2dZgd2Hc5ww6LGW5IprRvnK205sA/Fyw2l0/tfJDLn666vwbwbdsjB2A3cJZaXbX4R6HPxXfUYpoRvvcK3u8w1p2tuYdgOTinXWX/M6gm/W6We9e6gBYxpErohnt9oQQALyYcljK2o52U4RW4qP3v1lcn1nanIsm/spk+b2GK7uNUkQz2leOy1YR5ze2UjEAXcf7OusuffHbR7HEyuzj8dnH40qOhbYOtH5YbvcVDlcGumwVmgWgZ+4ry2oApISdtcQKAIrQLptXlSNkM3dWRwvHriVWUsJOrohmtM/9Mc+pP9d+BzAb/aXL2QfgpO+1xY0ZVdqdR6NxfsPrqPLY/blgJDaZK6JZAHrsG/ytPy5+JUrC9OpYW/Btp6385fJGu4V7KiTz00RJUD7kLr0pS4O/VbMA9KwclnG0BDoBCNnMyMKQLEsutuK9cx/3vfp+/hb0n2aEdrP/rq6WQKey82hG1ymto7aXs7oALG3OfX/3S1mWaIo5VtHEMvZd8yU5+1RIKK85q6ujtldPd+i0ZxlHb2iQEArAzOpP1//4JJGJAzjCBQqTOauLInQmmwZACNUbGtQ58dD/dFLjCfU09ivb9oPN8GcTH9y693Vu788nmdmW5CwAQkhPY3+NJ6SzNYryXNtUedbG2L+LfJ4WU0I2Pfnw5nOSbYzjcD3XAqj3Ng+2XQn52/f6vQIASMjfPth2pVjqKOKNiEKcXw9HJ5YP5j6n8EakyPYHSqF9ad8EmvbGYdobh2lvHKa9cZj2xlHa9uoDWRaivuutA0SCqIqo7VV/WzvklPbKMe2No7Tt/waMAZVdmP5lQAAAAABJRU5ErkJggg==)}.dyn-web .icon-wrapper{background-color:#9cce7c}.dyn-text svg:not(.dyn-experimental){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKgGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTExLTA4VDE2OjA2OjQxKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAyLTA4VDA3OjE2OjQzKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMi0wOFQwNzoxNjo0MyswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTNmNjRmNWUtMzQ4YS1hZDQyLTkzMjMtZTEyMzc2NWY5NDIwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Zjc1YjI2NGQtZjk4Mi1jYTQ3LTgwYjctMTQzMGE0MWQxMjExIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTgwOTA0YTctODFjOC1iYTRiLTljZDktMzE3M2Q2ZjQwY2FkIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSI3MjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjYzIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iNjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE4MDkwNGE3LTgxYzgtYmE0Yi05Y2Q5LTMxNzNkNmY0MGNhZCIgc3RFdnQ6d2hlbj0iMjAxOC0xMS0wOFQxNjowNjo0MSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmY2FkYzdmZS00ZTYyLTZkNGQtYmJmOC1lODNhOTEwYTg4NzkiIHN0RXZ0OndoZW49IjIwMTktMDItMDhUMDc6MTY6MjgrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YmM4Njc2ZDItZGNmYS1hMjQ2LWEwMTMtOWQ2ZDM3MWJjMmZlIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTA4VDA3OjE2OjQzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzZjY0ZjVlLTM0OGEtYWQ0Mi05MzIzLWUxMjM3NjVmOTQyMCIgc3RFdnQ6d2hlbj0iMjAxOS0wMi0wOFQwNzoxNjo0MyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiYzg2NzZkMi1kY2ZhLWEyNDYtYTAxMy05ZDZkMzcxYmMyZmUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MGRlOGZiZC03NzMxLWI0NDYtODMzYy1hNmE1MWFlZGU1MzEiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphODA5MDRhNy04MWM4LWJhNGItOWNkOS0zMTczZDZmNDBjYWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7vadRxAAAA3ElEQVRoge3asQ3CMBBGYRsZMgUVkzAMBZuwAQVzUDMJFVMQIpkWbESCwH6c9X+lleLp5IMU8fG4c2bN6ICvqJ5juz6kB+utCwuiZIKhd6f940FWP+9c6OoFfcT75MD2zVE9R/Uc2/XZL2bmvFlW6Hhpdbi8f6D12Y8OAGR79rbrtbUcbS3Hdr22lqOt5diur7q1P7+Erc9eW1uK6jmq56ieozdkjv5rObbri2xttcvW+uy1taWonqN6juo5queonpO959yuLkaiZIKhTw6y+ufP1v6c7Zujeo7t+jt53in3XvhauwAAAABJRU5ErkJggg==)}.dyn-text .icon-wrapper{background-color:#f28441}.main-wrapper{padding:5px;flex:1 1 255px;display:flex;flex-direction:column;justify-content:space-between}.main-wrapper button{align-self:flex-end}.main-wrapper .component-info{padding:10px;position:relative}.component-info p{margin-bottom:10px}svg.dyn-experimental{height:14px;position:absolute;top:4px;right:0}:host-context(html[dir=rtl]) svg.dyn-experimental{left:0;right:auto}
/*# sourceMappingURL=add-component-dialog.css.map */
`;var ao,mi=(ao=class{constructor(e,t){this.pageService=e,this.dialogService=t,this.area="main",this.experimentalTooltip=I.dynPageExperimentalFeatureMsg}addLinkList(e){let t=e?1:0;this.pageService.addLinkList(this.area,t).pipe(G(()=>Y())).subscribe(()=>this.showToast(`A ${e?"shortcuts":"link list"}`))}addImage(){this.pageService.addImage(this.area).pipe(G(()=>Y())).subscribe(()=>this.showToast("An image"))}addItems(){this.pageService.addItems(this.area).pipe(G(()=>Y())).subscribe(()=>this.showToast("An information"))}addWidget(){this.pageService.addWidget(this.area).pipe(G(()=>Y())).subscribe(()=>this.showToast("A widget"))}addWeb(){this.pageService.addWeb(this.area).pipe(G(()=>Y())).subscribe(()=>this.showToast("A web"))}addText(){this.pageService.addText(this.area).pipe(G(()=>Y())).subscribe(()=>this.showToast("A text"))}showToast(e){this.dialogService.showToast({title:"Component added",message:`${e} component has been added to the ${this.area} area`})}},ao.ctorParameters=()=>[{type:F},{type:$e}],ao);mi=d([p({template:Jl,styles:[Xl]})],mi);var Kl=`:host{display:flex;flex-direction:column;height:auto;border:1px solid}.header-wrapper{display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding:5px;cursor:pointer}.pane-wrapper{height:0;overflow:hidden}
/*# sourceMappingURL=dynamic-accordion.css.map */
`;var ed=`:host-context(.container-accordion){padding:0}:host{flex:1;display:flex;flex-direction:row;align-items:center;padding:0 10px}
/*# sourceMappingURL=dynamic-accordion.css.map */
`;var td=`:host{display:flex;flex-direction:column;border-top:1px solid;padding:15px}:host ::ng-deep .add-button-container{display:flex;flex-direction:row;justify-content:center;align-items:center;margin-top:10px}:host ::ng-deep .add-button-container:not(.empty) button{flex:1}:host ::ng-deep .add-button-container.empty{height:200px;margin-top:0;flex-direction:column}:host ::ng-deep .add-button-container.empty button{margin-top:20px}
/*# sourceMappingURL=dynamic-accordion.css.map */
`;var Es,Wt=(Es=class{constructor(){this.lightTheme=!1,this.paneIsCollapsed=!0,this.expanded=!1,this.setCaretIcon()}toggleExpanded(){this.expanded=!this.expanded,this.setCaretIcon()}setCaretIcon(){this.expanded?this.caretIcon="caret-up":this.caretIcon="caret-down"}collapse(){this.expanded=!1,this.setCaretIcon()}expand(){this.hasBeenExpanded=!0,this.expanded=!0,this.setCaretIcon()}setCollapsed(e){this.paneIsCollapsed=e}},Es.ctorParameters=()=>[],Es.propDecorators={paneTemplate:[{type:hr,args:[mr,{static:!1}]}],lightTheme:[{type:h}],entity:[{type:h}],automationIdentifier:[{type:h}]},Es);Wt=d([p({selector:"lm-dynamic-accordion",template:`
		<div
			class="header-wrapper"
			[attr.name]="automationIdentifier + '-header'"
			[attr.data-lm-a-dp-accheader]="entity"
			[class.lm-hdr-bg]="!lightTheme"
			[class.lm-item-bg]="lightTheme"
			(click)="toggleExpanded()">
			<ng-content
				style="display: none;"
				select="lm-dynamic-accordion-header"></ng-content>
			<button
				[name]="automationIdentifier + '-header-button'"
				soho-button="icon"
				[icon]="caretIcon"></button>
		</div>
		<div
			class="pane-wrapper lm-bg"
			[attr.name]="automationIdentifier + '-panel'"
			lm-expandable
			[isExpanded]="expanded"
			(afterCollapsed)="setCollapsed(true)"
			(onExpand)="setCollapsed(false)">
			<ng-template
				[ngTemplateOutlet]="paneTemplate"
				*ngIf="!paneIsCollapsed || hasBeenExpanded"></ng-template>
		</div>
	`,host:{class:"lm-brd"},styles:[Kl]})],Wt);var oo=class{};oo=d([p({selector:"lm-dynamic-accordion-header",template:" <ng-content></ng-content> ",styles:[ed]})],oo);var Ts,no=(Ts=class{constructor(e){this.pageService=e,this.isEnabled=!0,this.addButtonClicked=new V}ngOnInit(){this.area&&this.pageService.containerAdded.subscribe(e=>{e&&e.area&&e.area===this.area&&this.expandContainer(e.index)})}expandContainer(e){setTimeout(()=>{let t=this.containers;t.length&&(Tt.isNumber(e)?t.toArray()[e].expand():t.last.expand())},0)}},Ts.ctorParameters=()=>[{type:F}],Ts.propDecorators={containers:[{type:pr,args:[Wt]}],addButtonText:[{type:h}],entity:[{type:h}],addText:[{type:h}],isEmpty:[{type:h}],isEnabled:[{type:h}],area:[{type:h}],addButtonClicked:[{type:U}]},Ts);no=d([p({selector:"lm-dynamic-accordion-pane",template:`
		<ng-content></ng-content>
		<div
			class="add-button-container"
			*ngIf="addButtonText"
			[class.empty]="isEmpty">
			<div class="lm-text-align-c" *ngIf="addText && isEmpty">
				<p>{{ addText }}</p>
			</div>
			<button
				[id]="'lm-a-dp-add-button-' + entity"
				soho-button="primary"
				[disabled]="!isEnabled"
				[attr.data-lm-a-dp-accpane-btn]="entity"
				icon="add"
				(click)="addButtonClicked.emit()">
				{{ addButtonText }}
			</button>
		</div>
	`,host:{class:"lm-brd"},styles:[td]})],no);var ro,An=(ro=class{constructor(){this.queryChange=new V}ngAfterViewInit(){on(this.searchField.jQueryElement,"cleared").subscribe(()=>this.clearSearch())}clearSearch(){this.query="",this.onChange()}onChange(){this.queryChange.emit(this.query)}},ro.propDecorators={searchField:[{type:f,args:[Pi,{static:!1}]}],query:[{type:h}],queryChange:[{type:U}]},ro);An=d([p({selector:"filter-search",template:`
		<input
			soho-searchfield
			id="lm-a-dp-policy-inp"
			class="context filter-search"
			placeholder="Search for policies..."
			[clearable]="true"
			[(ngModel)]="query"
			(ngModelChange)="onChange()" />
	`})],An);var id=`<div\r
	class="page-editor-toolbar"\r
	[style.width]="headerWidth"\r
	[style.background-color]="defaultColor">\r
	<div class="page-title-cont">\r
		<h1>{{ isEditable ? "Editing" : "Viewing" }}</h1>\r
		<h2 id="lm-a-dp-editor-ttl" class="lm-truncate-text">\r
			{{ defaultSetting?.t }}\r
		</h2>\r
	</div>\r
	<p>\r
		<span id="lm-a-dp-savetext">{{ saveText }}</span>\r
	</p>\r
	<div class="button-cont">\r
		<div class="separator" *ngIf="saveText"></div>\r
		<button\r
			soho-button="tertiary"\r
			id="lm-a-dp-preview-btn"\r
			icon="search-list"\r
			(click)="preview()">\r
			Preview\r
		</button>\r
		<button\r
			soho-menu-button\r
			id="lm-a-dp-pa-btn"\r
			menu="lm-a-dp-pa-menu"\r
			type="button"\r
			icon="search-list"\r
			class="btn-menu lm-margin-zero-r">\r
			<span>Preview As</span>\r
		</button>\r
		<div class="separator"></div>\r
		<button class="btn-tertiary" id="lm-a-dp-close" (click)="close()">\r
			<svg\r
				class="icon exit-icon"\r
				aria-hidden="true"\r
				focusable="false"\r
				role="presentation"></svg>\r
			<span>Exit</span>\r
		</button>\r
	</div>\r
</div>\r
<ul soho-popupmenu id="lm-a-dp-pa-menu">\r
	<li soho-popupmenu-item>\r
		<a soho-popupmenu-label id="lm-a-dp-pa-u" (click)="previewAsUser()">\r
			User\r
		</a>\r
	</li>\r
	<li soho-popupmenu-item>\r
		<a soho-popupmenu-label id="lm-a-dp-pa-sp" (click)="previewAsPolicy()">\r
			Security Policy\r
		</a>\r
	</li>\r
</ul>\r
<div class="page-editor">\r
	<lm-admin-message-banner\r
		*ngIf="(missingAccesses | async)?.length && showRepair"\r
		[options]="repairMessageOptions"\r
		(dismissed)="showRepair = false"></lm-admin-message-banner>\r
	<div class="page-editor-row">\r
		<lm-dynamic-accordion\r
			class="settings-accordion"\r
			entity="settings"\r
			automationIdentifier="lm-a-dp-area-settings">\r
			<lm-dynamic-accordion-header>\r
				<h3>Page Settings</h3>\r
				<svg\r
					soho-icon\r
					[class.lm-display-none]="\r
						!(accessErrorMap | async)?.parents['settings']\r
					"\r
					icon="alert"\r
					[alert]="true"></svg>\r
			</lm-dynamic-accordion-header>\r
			<ng-template>\r
				<lm-dynamic-accordion-pane\r
					addButtonText="Add Configuration"\r
					entity="settings"\r
					[isEnabled]="isEditable"\r
					(addButtonClicked)="addSetting()"\r
					sortable-component\r
					(onSortStart)="onSortStart($event)"\r
					(onComponentSorted)="updateSettingsOrder($event)">\r
					<div class="page-setting-row list-header">\r
						<div class="page-setting-drag"></div>\r
						<div class="page-setting-priority">\r
							<p>Priority</p>\r
						</div>\r
						<div class="page-setting-title">\r
							<p>Title</p>\r
						</div>\r
						<div class="page-setting-color">\r
							<p>Page color</p>\r
						</div>\r
						<div class="page-setting-policy">\r
							<p>Applies to</p>\r
						</div>\r
						<div class="page-setting-config"></div>\r
					</div>\r
					<div\r
						class="page-setting-row list-item lm-brd"\r
						*ngFor="\r
							let setting of settings | async;\r
							let i = index;\r
							let defaultConfig = last\r
						"\r
						[class.default-config]="defaultConfig">\r
						<div class="page-setting-drag">\r
							<svg soho-icon *ngIf="!defaultConfig" icon="drag"></svg>\r
						</div>\r
						<div class="page-setting-priority">\r
							<p\r
								[attr.name]="setting.t | lmAutoId: 'lm-a-dp-setting-priority'"\r
								[attr.data-lm-a-dp-sett-p]="setting.eid">\r
								{{ i + 1 }}\r
							</p>\r
						</div>\r
						<div class="page-setting-title">\r
							<p class="lm-truncate-text">\r
								<span\r
									[attr.name]="setting.t | lmAutoId: 'lm-a-dp-setting-title'"\r
									[attr.data-lm-a-dp-sett-t]="setting.eid"\r
									(click)="editSetting(setting)"\r
									>{{ setting.t }}</span\r
								>\r
							</p>\r
						</div>\r
						<div class="page-setting-color">\r
							<lm-dynamic-page-color\r
								[value]="setting.cl"\r
								(onEdit)="editSetting(setting)"></lm-dynamic-page-color>\r
						</div>\r
						<div class="page-setting-policy">\r
							<svg soho-icon [icon]="setting.ais ? 'locked' : 'url'"></svg>\r
							<p\r
								class="lm-truncate-text"\r
								[attr.name]="setting.t | lmAutoId: 'lm-a-dp-setting-policy'"\r
								[attr.data-lm-ad-dp-sett-a]="setting.eid"\r
								(click)="editSetting(setting, true)">\r
								{{ getAccessText(setting) }}\r
							</p>\r
							<svg\r
								soho-icon\r
								*ngIf="(accessErrorMap | async).errors[setting.eid]"\r
								icon="alert"\r
								[alert]="true"\r
								soho-tooltip\r
								[content]="getAccessError(setting)"></svg>\r
						</div>\r
						<div class="page-setting-config">\r
							<button\r
								[name]="setting.t | lmAutoId: 'lm-a-dp-setting-menu-button'"\r
								soho-context-menu\r
								[attr.data-lm-a-dp-set-menubtn]="setting.eid"\r
								trigger="click"\r
								[menu]="'lm-a-dp-sm-' + setting.eid"\r
								[removeOnDestroy]="true"\r
								class="btn-actions">\r
								<svg soho-icon icon="more"></svg>\r
							</button>\r
							<ul\r
								soho-popupmenu\r
								[id]="'lm-a-dp-sm-' + setting.eid"\r
								[attr.name]="setting.t | lmAutoId: 'lm-a-dp-setting-menu'">\r
								<li soho-popupmenu-item>\r
									<a\r
										soho-popupmenu-label\r
										[id]="'lm-a-dp-sm-edit' + setting.eid"\r
										[name]="setting.t | lmAutoId: 'lm-a-dp-setting-edit'"\r
										(click)="editSetting(setting)"\r
										>{{ isEditable ? "Edit" : "View" }}</a\r
									>\r
								</li>\r
								<li soho-popupmenu-item *ngIf="!defaultConfig && isEditable">\r
									<a\r
										soho-popupmenu-label\r
										[id]="'lm-a-dp-sm-dlt' + setting.eid"\r
										[name]="setting.t | lmAutoId: 'lm-a-dp-setting-delete'"\r
										(click)="deleteSetting(setting)"\r
										>Delete</a\r
									>\r
								</li>\r
							</ul>\r
						</div>\r
					</div>\r
				</lm-dynamic-accordion-pane>\r
			</ng-template>\r
		</lm-dynamic-accordion>\r
	</div>\r
	<div class="page-editor-row">\r
		<div class="sidebar">\r
			<div class="section" *ngIf="isEditable">\r
				<h3 class="title">Quick add</h3>\r
				<div id="lm-a-dp-quick" class="content quick-add">\r
					<div\r
						id="{{ dynContainerIdentifiers.IMAGE }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>IMAGE</p>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.ITEMS }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>INFORMATION</p>\r
						<svg\r
							soho-icon\r
							class="dyn-experimental"\r
							icon="formula-constituents"\r
							soho-tooltip\r
							[content]="experimentalTooltip"></svg>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.LINK_LIST }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>LINK LIST</p>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.SHORTCUT }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>SHORTCUTS</p>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.TEXT }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>TEXT</p>\r
						<svg\r
							soho-icon\r
							class="dyn-experimental"\r
							icon="formula-constituents"\r
							soho-tooltip\r
							[content]="experimentalTooltip"></svg>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.WEB }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>WEB</p>\r
					</div>\r
					<div\r
						id="{{ dynContainerIdentifiers.WIDGET }}"\r
						class="draggable-component lm-brd-accent lm-item-bg"\r
						draggable-component>\r
						<svg soho-icon icon="drag"></svg>\r
						<p>WIDGET</p>\r
					</div>\r
				</div>\r
			</div>\r
			<ng-container *ngIf="componentFilters$ | async as compFilter">\r
				<div class="section" *ngIf="compFilter.hasContent">\r
					<h3 class="title">Filter by</h3>\r
					<div class="content lm-margin-md-t">\r
						<label soho-label>Component</label>\r
						<filter-item\r
							*ngIf="compFilter.hasImage"\r
							label="Image"\r
							filterId="lm-a-dp-imagesfilter"\r
							filterScope="type"\r
							filterEntity="images"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasItems"\r
							label="Information"\r
							filterId="lm-a-dp-userfilter"\r
							filterScope="type"\r
							filterEntity="items"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasLink"\r
							label="Link list"\r
							filterId="lm-a-dp-linksfilter"\r
							filterScope="type"\r
							filterEntity="links"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasShortcut"\r
							label="Shortcuts"\r
							filterId="lm-a-dp-shortcutsfilter"\r
							filterScope="type"\r
							filterEntity="shortcuts"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasWidget"\r
							label="Widget"\r
							filterId="lm-a-dp-widgetfilter"\r
							filterScope="type"\r
							filterEntity="widgets"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasWeb"\r
							label="Web"\r
							filterId="lm-a-dp-webfilter"\r
							filterScope="type"\r
							filterEntity="webs"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<filter-item\r
							*ngIf="compFilter.hasText"\r
							label="Text"\r
							filterId="lm-a-dp-textfilter"\r
							filterScope="type"\r
							filterEntity="texts"\r
							[(filter)]="filter">\r
						</filter-item>\r
						<ng-container *ngIf="accessFilters$ | async as accFilters">\r
							<div *ngIf="accFilters.length">\r
								<label soho-label class="lm-margin-md-t">Security policy</label>\r
								<filter-search [(query)]="policyQuery"></filter-search>\r
								<ng-container\r
									*ngFor="\r
										let activeFilter of filter?.access | keyvalue;\r
										index as i;\r
										let last = last\r
									">\r
									<a\r
										*ngIf="activeFilter.value === true"\r
										class="tag secondary is-dismissible hide-focus access-filter-tag">\r
										{{ accessTitles[activeFilter.key] || allUsersText }}\r
										<span\r
											class="btn-dismissible"\r
											[attr.name]="'lm-a-dp-filter-dismiss-' + i"\r
											[attr.data-lm-a-dp-flt]="activeFilter.key"\r
											(click)="disableAccessFilter(activeFilter.key)">\r
											<svg\r
												class="icon"\r
												focusable="false"\r
												aria-hidden="true"\r
												role="presentation">\r
												<use xlink:href="#icon-close"></use>\r
											</svg>\r
										</span>\r
									</a>\r
									<div *ngIf="last" class="lm-margin-sm-b"></div>\r
								</ng-container>\r
								<filter-item\r
									*ngIf="showAllUsersFilter"\r
									[label]="allUsersText"\r
									icon="url"\r
									filterId="lm-a-dp-accessfilter-all"\r
									filterScope="access"\r
									[filterEntity]="noPolicyKey"\r
									[(filter)]="filter">\r
								</filter-item>\r
								<ng-container\r
									*ngFor="\r
										let access of accFilters\r
											| lmSortByProperty: 't' : sortOptions\r
											| searchPolicyFilter: policyQuery : accFilters;\r
										let i = index;\r
										let last = last\r
									">\r
									<filter-item\r
										[label]="accessTitles[access.exid]"\r
										[filterId]="'lm-a-dp-accessfilter' + i"\r
										filterScope="access"\r
										[filterEntity]="access.exid"\r
										[(filter)]="filter"\r
										[errorText]="access.ec ? policyInvalidText : null"\r
										[class.lm-display-none]="i + 2 > accessFiltersLimit">\r
									</filter-item>\r
									<a\r
										soho-hyperlink\r
										id="lm-a-dp-flt-toggle"\r
										*ngIf="last && i + 1 > defaultAccessFiltersLimit"\r
										(click)="changeAccessFiltersLimit()">\r
										{{\r
											accessFiltersLimit === defaultAccessFiltersLimit\r
												? "Show\r
										all"\r
												: "Show less"\r
										}}\r
									</a>\r
								</ng-container>\r
							</div>\r
						</ng-container>\r
					</div>\r
				</div>\r
			</ng-container>\r
		</div>\r
		<div class="main">\r
			<div class="collapse-wrapper">\r
				<a soho-hyperlink id="lm-a-dp-collapse" (click)="collapseAll()"\r
					>Collapse all</a\r
				>\r
			</div>\r
			<div>\r
				<ng-container\r
					*ngTemplateOutlet="\r
						containersView;\r
						context: {\r
							containers: bannerContainers | async,\r
							accessErrors: accessErrorMap | async,\r
							query: bannerQuery,\r
							area: 'banner'\r
						}\r
					">\r
				</ng-container>\r
				<ng-container\r
					*ngTemplateOutlet="\r
						containersView;\r
						context: {\r
							containers: mainContainers | async,\r
							accessErrors: accessErrorMap | async,\r
							query: mainQuery,\r
							area: 'main'\r
						}\r
					">\r
				</ng-container>\r
\r
				<ng-template\r
					#containersView\r
					let-containers="containers"\r
					let-accessErrors="accessErrors"\r
					let-query="query"\r
					let-area="area">\r
					<div [hidden]="area === 'banner' && !showBannerArea">\r
						<lm-dynamic-accordion\r
							class="area-accordion"\r
							[entity]="area"\r
							[automationIdentifier]="'lm-a-dp-area-' + area">\r
							<lm-dynamic-accordion-header>\r
								<soho-toolbar>\r
									<soho-toolbar-title>\r
										{{ area + " area" | titlecase }}\r
										<svg\r
											soho-icon\r
											[class.lm-display-none]="\r
												accessErrors && !accessErrors.parents[area]\r
											"\r
											icon="alert"\r
											[alert]="true"></svg>\r
									</soho-toolbar-title>\r
									<soho-toolbar-button-set\r
										lm-click-stop-propagation\r
										[class.is-banner]="area === 'banner'">\r
										<input\r
											soho-toolbar-searchfield\r
											[id]="'lm-a-dp-banner-inp-' + area"\r
											[class.lm-display-none]="area === 'main'"\r
											[(ngModel)]="bannerQuery"\r
											(cleared)="bannerQuery = ''" />\r
										<input\r
											soho-toolbar-searchfield\r
											[id]="'lm-a-dp-main-inp-' + area"\r
											[class.lm-display-none]="area === 'banner'"\r
											[(ngModel)]="mainQuery"\r
											(cleared)="mainQuery = ''" />\r
									</soho-toolbar-button-set>\r
								</soho-toolbar>\r
							</lm-dynamic-accordion-header>\r
							<ng-template>\r
								<lm-dynamic-accordion-pane\r
									addButtonText="Add Component"\r
									addText="This area is empty. Start adding content by clicking Add Component."\r
									[entity]="area"\r
									[isEnabled]="isEditable"\r
									(addButtonClicked)="add(area)"\r
									[isEmpty]="!containers.length"\r
									sortable-component\r
									droppable-component\r
									[area]="area"\r
									[isContainer]="true"\r
									(onSortStart)="onSortStart($event)"\r
									(onComponentSorted)="updateLayout($event)"\r
									(onDropped)="onComponentDropped($event)">\r
									<div\r
										class="container-wrapper"\r
										*ngFor="\r
											let container of containers\r
												| refineBy: filter\r
												| searchFilter: query : accessTitles;\r
											trackBy: trackContainersBy;\r
											index as i\r
										">\r
										<div class="component-indicator">\r
											<span\r
												[style.background-color]="\r
													getComponentTypeColor(container.ct, container.st)\r
												"\r
												class="lm-brd">\r
												{{ getComponentTypeLabel(container.ct, container.st) }}\r
											</span>\r
										</div>\r
										<lm-dynamic-accordion\r
											[attr.name]="\r
												getComponentTypeLabel(container.ct, container.st)\r
													| lmAutoId: 'lm-a-dp-area-' + area\r
											"\r
											class="container-accordion"\r
											[lightTheme]="true"\r
											[entity]="container.eid"\r
											droppable-component\r
											[area]="area"\r
											[automationIdentifier]="\r
												getComponentTypeLabel(container.ct, container.st)\r
													| lmAutoId: 'lm-a-dp-' + area\r
											"\r
											[dropIndex]="i"\r
											(onDropped)="onComponentDropped($event)">\r
											<lm-dynamic-accordion-header>\r
												<svg\r
													[attr.name]="\r
														getComponentTypeLabel(container.ct, container.st)\r
															| lmAutoId: 'lm-a-dp-drag-' + area\r
													"\r
													soho-icon\r
													icon="drag"\r
													lm-click-stop-propagation></svg>\r
												<span\r
													[class.lm-display-none]="!container.i"\r
													[class.clt-inherit]="\r
														container.clt === dynColorTypes.InheritPage\r
													"\r
													class="dyn-icon"\r
													[style.background-color]="\r
														container.clt === dynColorTypes.Custom\r
															? (container.icl | lmColorNumberToHexExtended)\r
															: '#fff'\r
													">\r
													<svg class="icon" focusable="false">\r
														<use [attr.xlink:href]="container.i || ''"></use>\r
													</svg>\r
												</span>\r
												<h4\r
													class="container-title"\r
													[attr.name]="\r
														getComponentTypeLabel(container.ct, container.st)\r
															| lmAutoId: 'lm-a-dp-title-' + area : 'component'\r
													"\r
													[attr.data-lm-a-dp-cont-ttl]="container.eid"\r
													[class.custom]="container.t">\r
													{{ container.t || defaultTitle }}\r
													<svg\r
														soho-icon\r
														[class.lm-display-none]="\r
															!accessErrors.parents[container.eid]\r
														"\r
														icon="alert"\r
														[alert]="true"></svg>\r
												</h4>\r
												<div\r
													class="access-information"\r
													[attr.name]="\r
														getComponentTypeLabel(container.ct, container.st)\r
															| lmAutoId: 'lm-a-dp-policycont-' + area\r
													"\r
													[attr.data-lm-a-dp-cont-accs-div]="container.eid"\r
													lm-click-stop-propagation\r
													(click)="editContainerAccess(container)">\r
													<span class="access-label">Visible for:</span>\r
													<svg\r
														soho-icon\r
														[icon]="container.ais ? 'locked' : 'url'"></svg>\r
													<span\r
														[attr.name]="\r
															getComponentTypeLabel(container.ct, container.st)\r
																| lmAutoId: 'lm-a-dp-policy-' + area\r
														"\r
														class="access-value lm-truncate-text">\r
														{{ getAccessText(container) }}\r
													</span>\r
													<svg\r
														soho-icon\r
														[attr.name]="\r
															getComponentTypeLabel(container.ct, container.st)\r
																| lmAutoId: 'lm-a-dp-policyerror-' + area\r
														"\r
														[class.lm-display-none]="\r
															!accessErrors.errors[container.eid]\r
														"\r
														icon="alert"\r
														[alert]="true"\r
														soho-tooltip\r
														[content]="getAccessError(container)"></svg>\r
												</div>\r
												<div class="separator lm-hdr-bg"></div>\r
												<button\r
													soho-button="icon"\r
													[name]="\r
														getComponentTypeLabel(container.ct, container.st)\r
															| lmAutoId: 'lm-a-dp-settings-' + area\r
													"\r
													[attr.data-lm-a-dp-cont-set-btn]="container.eid"\r
													icon="settings"\r
													lm-click-stop-propagation\r
													(click)="\r
														openContainerSettings(container, area)\r
													"></button>\r
												<button\r
													soho-button="icon"\r
													[name]="\r
														getComponentTypeLabel(container.ct, container.st)\r
															| lmAutoId: 'lm-a-dp-delete-' + area\r
													"\r
													[attr.data-lm-a-dp-cont-dlt-btn]="container.eid"\r
													icon="delete"\r
													lm-click-stop-propagation\r
													[disabled]="!isEditable"\r
													(click)="deleteContainer(container, area)"></button>\r
											</lm-dynamic-accordion-header>\r
											<ng-template>\r
												<lm-dynamic-accordion-pane\r
													sortable-component\r
													(onSortStart)="onSortStart($event)"\r
													(onComponentSorted)="\r
														updateItemOrder($event, container)\r
													">\r
													<lm-dynamic-link-list\r
														*ngIf="container.ct === dynContainerTypes.Links"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isShortcut]="container.st === 1"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-link-list>\r
													<lm-dynamic-image-list\r
														*ngIf="container.ct === dynContainerTypes.Image"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-image-list>\r
													<lm-dynamic-information-list\r
														*ngIf="container.ct === dynContainerTypes.Items"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-information-list>\r
													<lm-dynamic-widget-list\r
														*ngIf="container.ct === dynContainerTypes.Widget"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-widget-list>\r
													<lm-dynamic-web-list\r
														*ngIf="container.ct === dynContainerTypes.Web"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-web-list>\r
													<lm-dynamic-text-list\r
														*ngIf="container.ct === dynContainerTypes.Text"\r
														[area]="area"\r
														[container]="container"\r
														[accessTitles]="accessTitles"\r
														[accessErrors]="accessErrors"\r
														[query]="query"\r
														[filter]="filter"\r
														[isEditable]="isEditable">\r
													</lm-dynamic-text-list>\r
												</lm-dynamic-accordion-pane>\r
											</ng-template>\r
										</lm-dynamic-accordion>\r
									</div>\r
								</lm-dynamic-accordion-pane>\r
							</ng-template>\r
						</lm-dynamic-accordion>\r
					</div>\r
				</ng-template>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var sd=`.page-editor-toolbar{display:flex;width:100%;padding:0 20px;background-color:#000;position:fixed;top:60px;height:60px;overflow:hidden;transition:background-color .5s cubic-bezier(.17,.04,.03,.94)}.page-editor-toolbar .page-title-cont{display:flex;flex-direction:column;justify-content:center;flex:1;padding-right:20px}.page-editor-toolbar p,.page-editor-toolbar .button-cont .separator,.page-editor-toolbar .button-cont button,.page-editor-toolbar .button-cont button ::ng-deep .icon{color:#ffffffb3}.page-editor-toolbar .button-cont button:hover,.page-editor-toolbar .button-cont button:hover ::ng-deep .icon{color:#fff}.page-editor-toolbar .button-cont .exit-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRkQxOTg5QkIzQzExRTg4RkM0RjY4RUUzQUJBN0REIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRkQxOThBQkIzQzExRTg4RkM0RjY4RUUzQUJBN0REIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZGRDE5ODdCQjNDMTFFODhGQzRGNjhFRTNBQkE3REQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZGRDE5ODhCQjNDMTFFODhGQzRGNjhFRTNBQkE3REQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz40sVKsAAABDUlEQVR42mL4//8/AxAHAfHF/5jgHxDHQNXgxSwMDAyRQLyMATtgBGIeBiIAI9C020BaBYhXAHELEH9Fkv8JxM+JMYgByRsSRHihD4iLsMkhGyRAhEEXoGpL0eWYGMgDXUCciSzAgkexHBALoYlxIrGnQenp6GGE7rXn/4kDcbDoxwU4ifTmfCD+DYr+/1ABQSD+gKQAxOYn0rBX5AY2MvgOStT4DHpPhCG/gTgCiPfhC2weIFZAw9eQ1P8CYj/kvIYLfIFiZPALSv+D5tFNMAlkr3EQGSYgQ+KAeC16XrsNdepyINZG84okmndBWSMMV16LJJDgMogpj0BeWw7EwUB8CVvhgCWcsAKAAAMAYi3IM4+EJV8AAAAASUVORK5CYII=);background-repeat:no-repeat;opacity:.7;width:18px}.page-editor-toolbar .button-cont button:hover .exit-icon{opacity:1}.page-editor-toolbar>.button-cont{display:flex;align-items:center}.page-editor-toolbar .button-cont .separator{display:inline-block;height:20px;width:1px;background-color:#ffffffb3;margin:0 15px}.page-editor-toolbar .button-cont .btn-tertiary{min-width:0}.page-editor-toolbar h1,h2{color:#fff}.page-editor-toolbar>p{max-height:60px;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;flex:0 1 250px}.page-editor{padding:20px;position:relative}.page-editor a[soho-hyperlink]:after{border:none;box-shadow:none}.page-editor-row{display:flex;padding:20px 0;overflow:hidden}.sidebar{flex:0 1 300px;padding-left:3px}.sidebar .section{margin-bottom:20px}.sidebar ::ng-deep svg[icon=alert]{top:0;margin-left:5px;margin-top:0;width:16px;height:16px}.sidebar svg.dyn-experimental{height:14px}.sidebar .quick-add{display:flex;flex-wrap:wrap;margin-top:10px}.sidebar .quick-add .draggable-component{display:flex;align-items:center;flex-direction:row;margin:0 10px 10px 0;padding:5px 10px 5px 0;cursor:move;border-radius:2px;border:1px solid;z-index:100;border-left:4px solid}.sidebar .quick-add .draggable-component#lm-a-dp-di{border-left-color:#efa836!important}.sidebar .quick-add .draggable-component#lm-a-dp-sc{border-left-color:#8ed1c6!important}.sidebar .quick-add .draggable-component#lm-a-dp-dl{border-left-color:#c7b4db!important}.sidebar .quick-add .draggable-component#lm-a-dp-du{border-left-color:#54a1d3!important}.sidebar .quick-add .draggable-component#lm-a-dp-dw{border-left-color:#eb9d9d!important}.sidebar .quick-add .draggable-component#lm-a-dp-wb{border-left-color:#c0e8ac!important}.sidebar .quick-add .draggable-component#lm-a-dp-tx{border-left-color:#fda874!important}.sidebar .quick-add .draggable-component p{font-size:11px;font-weight:700}.sidebar ::ng-deep .searchfield-wrapper{margin-bottom:10px;max-width:90%}.sidebar .access-filter-tag{margin:0 5px 5px 0;height:auto;max-width:265px;white-space:-webkit-pre-wrap;word-wrap:break-word}.main{flex:1 1 800px;max-width:80%}.main .collapse-wrapper{display:flex;justify-content:flex-end;margin-bottom:10px}.main .collapse-wrapper a,.section .content a{text-decoration:none}:host ::ng-deep .dyn-icon{width:20px;height:20px;border-radius:50%;position:relative;margin-right:5px}:host ::ng-deep .dyn-icon>svg{color:#fff;height:10px;width:20px;top:5px}:host ::ng-deep .dyn-icon.clt-inherit>svg{color:#000}.container-title{font-size:14px;font-style:italic;font-weight:400;flex:1 0 auto}.container-title.custom{font-style:normal}.container-title svg{top:0}.access-information{display:flex;align-items:center;cursor:pointer;min-width:0;margin-left:5px}.access-information svg[soho-icon]{flex:0 0 auto;height:16px;width:16px}.access-information svg[icon=alert],.page-setting-policy svg[icon=alert],.settings-accordion lm-dynamic-accordion-header svg{top:0;margin-left:5px}.access-information span{font-size:12px;line-height:12px}.access-information span.access-label{flex:1 0 auto;margin-right:5px}.access-information span.access-value{margin-left:5px;font-weight:700}lm-dynamic-accordion-pane.ui-droppable-hover ::ng-deep .add-button-container{visibility:hidden}lm-dynamic-accordion-pane.ui-droppable-hover,lm-dynamic-accordion.ui-droppable-hover{opacity:.5}lm-dynamic-accordion-header soho-toolbar{flex:1;margin-bottom:0}soho-toolbar-button-set ::ng-deep .searchfield-wrapper{display:inline-block}soho-toolbar-button-set:not(.is-banner) ::ng-deep .searchfield-wrapper:first-child{display:none}soho-toolbar-button-set.is-banner ::ng-deep .searchfield-wrapper:last-child{display:none}.settings-accordion{flex:1 1 auto;max-width:100%}.component-indicator span{display:inline-block;padding:4px 7px;font-size:8px;color:#1a1a1a;border:1px solid;border-bottom:none;text-transform:uppercase}.container-accordion{margin-bottom:10px}.container-accordion .separator{display:inline-block;height:20px;width:1px;margin:0 5px 0 15px}.container-accordion lm-dynamic-accordion-header .clt-inherit{background:radial-gradient(transparent 57%,#1a1a1a 34%)}.area-accordion{margin:0 0 20px}svg[icon=drag]{cursor:move}.flex-grow{flex:1 0}.page-setting-row{display:flex;flex-direction:row;align-items:center}.page-setting-row>div{min-width:0}.page-setting-row.list-item{border-bottom:1px solid}.page-setting-row.list-item.default-config{margin-bottom:20px}.page-setting-row.list-item p>span{cursor:pointer}.page-setting-row.list-item:not(.default-config) .page-setting-policy p{cursor:pointer}.page-setting-row .page-setting-drag{flex:0 0 40px}.page-setting-row .page-setting-priority{flex:0 0 60px}.page-setting-row .page-setting-title{flex:2 1 100px}.page-setting-row .page-setting-color{flex:0 1 150px}.page-setting-row .page-setting-policy{flex:1 1 100px;display:flex;align-items:center}.page-setting-row .page-setting-policy .icon{flex:0 0 auto}.page-setting-row .page-setting-policy p{margin-left:5px}.page-setting-row .page-setting-config{flex:0 0 40px}
/*# sourceMappingURL=dynamic-page-editor.css.map */
`;var ad=`:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component{margin:0 0 10px 10px;padding:5px 0 5px 10px;border-right:4px solid;border-left:1px solid!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-di{border-right-color:#efa836!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-sc{border-right-color:#8ed1c6!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-dl{border-right-color:#c7b4db!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-du{border-right-color:#54a1d3!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-dw{border-right-color:#eb9d9d!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-wb{border-right-color:#c0e8ac!important}:host-context(html[dir=rtl]) .sidebar .quick-add .draggable-component#lm-a-dp-tx{border-right-color:#fda874!important}:host-context(html[dir=rtl]) .access-information span.access-label{margin-left:5px;margin-right:0}:host-context(html[dir=rtl]) .access-information span.access-value{margin-right:5px;margin-left:0}:host-context(html[dir=rtl]) .page-editor-toolbar .page-title-cont{padding:0 0 0 20px}:host-context(html[dir=rtl]) .page-setting-row .page-setting-policy p{margin-left:0;margin-right:5px}:host-context(html[dir=rtl]) ::ng-deep .dyn-icon{margin-left:5px;margin-right:0}
/*# sourceMappingURL=dynamic-page-editor-rtl.css.map */
`;var od=`:host{display:flex}.img-icon{width:20px;height:20px;flex:0 0 20px;border-radius:2px;margin-right:5px}.img-text{flex:1 0 auto}.img-text p{cursor:pointer}:host-context(html[dir="rtl"]) .img-icon{margin-left:5px;margin-right:0}
/*# sourceMappingURL=dynamic-page-editor.css.map */
`;var nd=`label{max-width:265px;word-wrap:break-word}.custom-icon{width:16px;height:16px;top:-5px}
/*# sourceMappingURL=dynamic-page-editor.css.map */
`;var lo,Pn=(lo=class extends R{constructor(e,t,i){super("DynamicFilterService",t,e),this.pageService=i,this.accessFilters$=this.pageService.editedPage.pipe(N(s=>s?s.accs.filter(a=>{if(!s.cts)return!1;let o=a.exid;if(x.containsAccess(s.cts,o))return!0;for(let n of s.cts)if(x.containsAccess(n.its,o)||x.containsAccess(n.ims,o)||x.containsAccess(n.ws,o)||x.containsAccess(n.hds,o)||x.containsAccess(n.wbs,o)||x.containsAccess(n.txts,o))return!0}):null)),this.componentFilters$=this.pageService.editedPage.pipe(N(s=>{if(s){let a={hasContent:!1},o=s.cts||[];for(let n of o)switch(n.ct){case k.Links:n.st===1?a.hasShortcut=!0:a.hasLink=!0;break;case k.Image:a.hasImage=!0;break;case k.Items:a.hasItems=!0;break;case k.Widget:a.hasWidget=!0;break;case k.Web:a.hasWeb=!0;break;case k.Text:a.hasText=!0;break;default:this.logDebug(`componentFilters: Unknown container type: ${n.ct}`);break}return a.hasContent=a.hasLink||a.hasShortcut||a.hasImage||a.hasItems||a.hasWidget||a.hasWeb||a.hasText,a}}))}},lo.ctorParameters=()=>[{type:L},{type:b},{type:F}],lo);Pn=d([ye({providedIn:"root"})],Pn);var rd=`<div style="max-width: 450px">\r
	<div soho-tab-list-container>\r
		<div soho-tabs>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-cs-basictab" tabId="tab-basic">Basic</a>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-cs-trantab" tabId="tab-translations"\r
						>Translations</a\r
					>\r
				</li>\r
			</ul>\r
			<div soho-tab-panel-container>\r
				<div soho-tab-panel tabId="tab-basic">\r
					<div class="field">\r
						<label soho-label>Title</label>\r
						<input\r
							[(ngModel)]="container.t"\r
							id="lm-a-dp-cs-ttl-inp"\r
							maxlength="128"\r
							class="input-lg"\r
							(ngModelChange)="onTitleChange($event)" />\r
					</div>\r
\r
					<lm-icon-selector\r
						[icon]="container.i"\r
						[color]="container.icl"\r
						[colorType]="container.clt"\r
						[hasParent]="false"\r
						(iconChanged)="onIconChanged($event)"\r
						(colorChanged)="onColorChanged($event)"\r
						(colorTypeChanged)="onColorTypeChanged($event)"></lm-icon-selector>\r
\r
					<div class="field lm-margin-md-t" *ngIf="isLinkList">\r
						<label class="lm-margin-md-b">Collapsible links</label>\r
						<input\r
							soho-radiobutton\r
							id="lm-dp-cs-expnone-chk"\r
							type="radio"\r
							[value]="expandStrategies.None"\r
							[(ngModel)]="container.ex" />\r
						<label\r
							soho-label\r
							id="lm-dp-cs-clinks-no-label"\r
							for="lm-dp-cs-expnone-chk"\r
							[forRadioButton]="true"\r
							>No</label\r
						>\r
						<br />\r
						<input\r
							soho-radiobutton\r
							id="lm-dp-cs-expexp-chk"\r
							type="radio"\r
							[value]="expandStrategies.Expanded"\r
							[(ngModel)]="container.ex" />\r
						<label\r
							soho-label\r
							id="lm-dp-cs-clinks-yes-expanded-label"\r
							for="lm-dp-cs-expexp-chk"\r
							[forRadioButton]="true"\r
							>Yes (expanded by default)</label\r
						>\r
						<br />\r
						<input\r
							soho-radiobutton\r
							id="lm-dp-cs-expcoll-chk"\r
							type="radio"\r
							[value]="expandStrategies.Collapsed"\r
							[(ngModel)]="container.ex" />\r
						<label\r
							soho-label\r
							id="lm-dp-cs-clinks-yes-collapsed-label"\r
							for="lm-dp-cs-expcoll-chk"\r
							[forRadioButton]="true"\r
							>Yes (collapsed by default)</label\r
						>\r
					</div>\r
\r
					<div\r
						class="field"\r
						*ngIf="isMainAreaContainer"\r
						lm-widget-size-display\r
						[size]="size"\r
						[includeSizeSelector]="true"\r
						selectionLabel="Sizing"\r
						(sizeChanged)="setSize($event)"></div>\r
\r
					<div class="modal-buttonset">\r
						<button\r
							type="button"\r
							id="lm-a-dp-cs-cncl-btn"\r
							class="btn-modal"\r
							(click)="modalDialog?.close()">\r
							Cancel\r
						</button>\r
						<button\r
							type="button"\r
							id="lm-a-dp-cs-save-btn"\r
							class="btn-modal-primary"\r
							(click)="save()">\r
							{{ isEditable ? "Save" : "OK" }}\r
						</button>\r
					</div>\r
				</div>\r
				<div soho-tab-panel tabId="tab-translations">\r
					<lm-dynamic-page-translations\r
						[localizations]="container?.lzn"\r
						[optionsItems]="optionsItems"\r
						[isAddDisabled]="!isTranslateable"\r
						(localizationChange)="onLocalizationChange($event)">\r
					</lm-dynamic-page-translations>\r
				</div>\r
			</div>\r
		</div>\r
	</div>\r
</div>\r
`;var ld=`button.btn-icon:focus{box-shadow:none}.moreIconsButton{font-size:12px;font-color:#5c5c5c;padding:0 6px}svg.selected,button.btn-icon:hover svg.selected{color:#fff}
/*# sourceMappingURL=container-settings-dialog.css.map */
`;var mo,ks=(mo=class extends hn{constructor(e,t){super("ContainerSettingsDialogComponent",t),this.pageService=e,this.containerTypes=k,this.expandStrategies=Vn,this.optionsItems=[{name:"t",label:"Title",labelId:"lm-a-dp-cs-at-t-lbl",valueId:"lm-a-dp-cs-at-t-inp",maxLength:I.dynPageDefaultMaxLength,defaultValue:""}]}ngOnInit(){this.initModalDialog();let e=this.container,t={cols:e.cs?e.cs:1,rows:e.rs?e.rs:1};this.setSize(t),this.size=t,this.isLinkList=e.ct===k.Links&&!e.st,this.isLinkList&&W.isUndefined(e.ex)&&(this.container.ex=Vn.None),this.onTitleChange(e.t)}setSize(e){this.container.cs=e.cols,this.container.rs=e.rows}onIconChanged(e){this.container.i=e}onColorChanged(e){this.container.icl=e}onColorTypeChanged(e){this.container.clt=e}save(){if(!this.isEditable)return;let e=v.copy(this.container),t=this.hasInvalidTranslations(e.lzn);if(this.containerLznEdited)if(t){let i=this.getInvalidTranslations(e.lzn);e.lzn=D(D({},i),this.containerLznEdited)}else e.lzn=this.containerLznEdited;else t?e.lzn=this.getInvalidTranslations(e.lzn):e.lzn=null;this.hasInvalidTranslations(e.lzn)?this.showConfirmDiscardTranslations().subscribe(()=>{this.deleteTranslations(e.lzn),this.submitSafe(this.pageService.updateContainer(e,this.container)).subscribe()},null,()=>this.setCanClose(!0)):this.submitSafe(this.pageService.updateContainer(e,this.container)).subscribe()}onLocalizationChange(e){let t=this.containerLznEdited=e||{};for(let i of Object.keys(t))this.container.lzn&&this.container.lzn[i]&&(t[i].its=this.container.lzn[i].its),t[i].op===pe.Delete&&this.container.lzn[i].its&&Object.keys(this.container.lzn[i].its).length>0&&(t[i]={t:"",op:pe.Update,its:this.container.lzn[i].its,eid:this.container.lzn[i].eid})}onTitleChange(e){let t=this.getTranslationItemIndex("t");t>-1&&(this.optionsItems[t].defaultValue=e),this.setIsTranslateable(),this.optionsItems=[...this.optionsItems]}setIsTranslateable(){this.isTranslateable=this.container.t&&this.container.t.length>0}hasInvalidTranslation(e){return!this.isTranslateable&&e&&e.t&&e.t.length&&e.t.length>0}deleteTranslation(e){this.container.t&&this.container.t.length||(e.t="")}},mo.ctorParameters=()=>[{type:F},{type:b}],mo);ks=d([p({template:rd})],ks);var Os,Dn=(Os=class{constructor(e,t){this.viewContainerRef=e,this.dialogService=t,this.enableTheming=!0,this.hasParent=!0,this.isDisabled=!1,this.showAllIcons=!1,this.isIconMandatory=!1,this.iconChanged=new V,this.colorChanged=new V,this.colorTypeChanged=new V,this.basicIcons=["#icon-agent","#icon-user","#icon-group-selection","#lime-icon-shortcut","#lime-icon-hands","#icon-phone","#lime-icon-checklist","#icon-map-pin","#icon-insert-image","#icon-star-filled","#icon-cloud","#icon-key","#icon-timer","#icon-notification","#icon-zoom-in","#icon-zoom-out","#icon-link"],this.extraIcons=["#lime-icon-calc","#lime-icon-truck","#lime-icon-wrench","#lime-icon-thumb","#lime-icon-settings","#icon-edit","#lime-icon-factory","#lime-icon-drawer","#lime-icon-dollar","#lime-icon-diagram","#lime-icon-note","#icon-server","#icon-screen","#icon-scale","#icon-run-job","#icon-reply","#icon-reply-all","#icon-quick-reference","#icon-purchasing","#icon-ledger","#icon-genealogy","#icon-new-case","#icon-enterprise-planning","#icon-mobile","#icon-area","#lime-icon-bag","#icon-info","#icon-mingle-share","#icon-tools","#icon-formula-constituents","#icon-counter-clockwise-90","#icon-headphones","#icon-distribution","#icon-line-chart","#icon-script","#icon-binoculars","#icon-help","#lime-icon-heartrate","#icon-warehouse","#icon-travel-plan","#icon-thumbs-up","#icon-special-item","#icon-service","#lime-icon-timebook","#lime-icon-window","#lime-icon-window-fields","#lime-icon-window-open","#icon-bookmark-filled","#icon-project","#icon-technology","#icon-contacts","#icon-heart-outlined","#icon-heart-filled","#icon-exclamation","#icon-workflow","#icon-cascade-objects","#icon-decrease-row-line-height","#icon-design-mode","#icon-lasso","#icon-rocket","#icon-bubble","#icon-articles","#icon-connections","#icon-employee-directory","#icon-calendar","#icon-cart","#icon-checkbox","#icon-document","#icon-sec-menu-expand","#icon-notes","#icon-print","#icon-url","#icon-mail","#icon-map","#lime-icon-doc","#lime-icon-doc-html","#lime-icon-doc-pdf","#lime-icon-doc-ppt","#lime-icon-doc-txt","#lime-icon-doc-xls"],this.allIcons=[...this.basicIcons,...this.extraIcons],this.maxIconsToShow=this.basicIcons.length+1,this.colorpickerOptions=le.getColorpickerOptionsExtended(),this.colorTypes=ie}ngAfterViewInit(){this.enableTheming&&!this.selectedColorType&&(this.selectedColorType=this.selectedColorNr?ie.Custom:this.hasParent?ie.InheritParent:ie.InheritPage,this.onColorTypeChange()),this.selectedColorNr?this.setColor(this.selectedColorNr):this.setColor(0),this.icons=this.showAllIcons?this.allIcons:this.basicIcons,this.selectedIcon&&!u.contains(this.basicIcons,this.selectedIcon)&&this.basicIcons.push(this.selectedIcon),this.isIconMandatory&&!this.selectedIcon&&this.setIcon(this.basicIcons[0])}setIcon(e){if(this.selectedIcon!==e)this.selectedIcon=e;else{if(this.isIconMandatory)return;this.selectedIcon=null}this.iconChanged.emit(this.selectedIcon)}openIconDialog(){let e=this.dialogService.modal(co,this.viewContainerRef).title("More Icons").id("lm-a-dp-moreicons-dialog").afterClose(t=>{t&&(u.contains(this.basicIcons,t)||(this.basicIcons.length===this.maxIconsToShow&&this.basicIcons.pop(),this.basicIcons.push(t)),this.setIcon(t))});e.apply(t=>{t.iconsDialog=e,t.iconColor=this.selectedColorNr,t.selectedIcon=this.selectedIcon}).open()}onColorChange(e){let t=this.colorpicker.getHexValue();this.selectedColorHex=t,this.colorChanged.emit(le.hexCodeToNumberExtended(t))}onColorTypeChange(){this.isColorpickerDisabled()&&(this.setColor(0),this.colorChanged.emit(le.hexCodeToNumberExtended(this.selectedColorHex)),this.colorpicker&&setTimeout(()=>{this.colorpicker.disabled=!0})),this.colorTypeChanged.emit(this.selectedColorType)}isColorpickerDisabled(){let e=this.enableTheming&&this.selectedColorType!==ie.Custom;return this.isDisabled||e}setColor(e){this.selectedColorNr=e,this.selectedColorHex=le.numberToHexCodeExtended(e)}},Os.ctorParameters=()=>[{type:A},{type:w}],Os.propDecorators={colorpicker:[{type:f,args:[Et,{static:!1}]}],selectedIcon:[{type:h,args:["icon"]}],selectedColorNr:[{type:h,args:["color"]}],selectedColorType:[{type:h,args:["colorType"]}],enableTheming:[{type:h}],hasParent:[{type:h}],isDisabled:[{type:h}],showAllIcons:[{type:h}],isIconMandatory:[{type:h}],iconChanged:[{type:U}],colorChanged:[{type:U}],colorTypeChanged:[{type:U}]},Os);Dn=d([p({selector:"lm-icon-selector",template:`
		<div class="field">
			<label class="lm-margin-md-b" *ngIf="!showAllIcons">Icon</label>
			<button
				class="btn-icon lm-margin-sm-b"
				*ngFor="let icon of icons; let i = index"
				[name]="'lm-a-dp-iconselector-icon-' + i"
				[attr.data-lm-a-dp-is-icon]="i"
				[disabled]="isDisabled"
				(click)="setIcon(icon)"
				[style.background-color]="
					selectedIcon === icon ? selectedColorHex : null
				">
				<svg
					class="icon"
					aria-hidden="true"
					focusable="false"
					style="top: -1px; height: 19px;"
					[class.selected]="icon === selectedIcon">
					<use [attr.xlink:href]="icon" />
				</svg>
			</button>
			<div *ngIf="!showAllIcons">
				<button
					class="moreIconsButton hyperlink"
					id="lm-a-dp-is-more-btn"
					[disabled]="isDisabled"
					[style.cursor]="isDisabled ? 'default' : 'pointer'"
					(click)="openIconDialog()">
					More...
				</button>
			</div>
		</div>
		<ng-container *ngIf="!showAllIcons">
			<div class="field lm-margin-zero-b">
				<label class="lm-margin-md-b">Icon background color</label>
				<ng-container *ngIf="enableTheming">
					<ng-container *ngIf="hasParent">
						<input
							soho-radiobutton
							name="icon-color-type"
							id="lm-a-dp-is-typeparent-chk"
							type="radio"
							[value]="colorTypes.InheritParent"
							(change)="onColorTypeChange()"
							[(ngModel)]="selectedColorType"
							[attr.disabled]="isDisabled ? '' : null" />
						<label
							id="lm-a-dp-is-componentcolor-label"
							soho-label
							for="lm-a-dp-is-typeparent-chk"
							[forRadioButton]="true"
							>Use component icon color</label
						>
						<br />
					</ng-container>
					<input
						soho-radiobutton
						name="icon-color-type"
						id="lm-a-dp-is-typepage-chk"
						type="radio"
						[value]="colorTypes.InheritPage"
						(change)="onColorTypeChange()"
						[(ngModel)]="selectedColorType"
						[attr.disabled]="isDisabled ? '' : null" />
					<label
						id="lm-a-dp-is-pagecolor-label"
						soho-label
						for="lm-a-dp-is-typepage-chk"
						[forRadioButton]="true"
						>Use page color</label
					>
					<br />
					<input
						soho-radiobutton
						name="icon-color-type"
						id="lm-a-dp-is-typecustom-chk"
						type="radio"
						[value]="colorTypes.Custom"
						(change)="onColorTypeChange()"
						[(ngModel)]="selectedColorType"
						[attr.disabled]="isDisabled ? '' : null" />
					<label
						id="lm-a-dp-is-customcolor-label"
						soho-label
						for="lm-a-dp-is-typecustom-chk"
						[forRadioButton]="true"
						>Select custom color</label
					>
					<br />
				</ng-container>
			</div>
			<div class="field">
				<input
					id="lm-a-dp-is-color-inp"
					soho-colorpicker
					[(ngModel)]="selectedColorHex"
					[editable]="colorpickerOptions.editable"
					[showLabel]="colorpickerOptions.showLabel"
					[colors]="colorpickerOptions.colors"
					[disabled]="isColorpickerDisabled()"
					[clearable]="false"
					[attributes]="{ name: 'id', value: 'lm-a-dp-icon-selector-color' }"
					(change)="onColorChange($event)" />
			</div>
		</ng-container>
	`,styles:[ld]})],Dn);var co=class{onIconChanged(e){this.icon=e}cancel(){this.iconsDialog.close()}save(){this.iconsDialog.close(this.icon)}};co=d([p({template:`
		<div style="max-width: 390px">
			<lm-icon-selector
				[icon]="selectedIcon"
				[color]="iconColor"
				[showAllIcons]="true"
				[isDisabled]="false"
				(iconChanged)="onIconChanged($event)">
			</lm-icon-selector>
			<div class="modal-buttonset">
				<button
					name="lm-a-moreicons-cancel"
					type="button"
					class="btn-modal"
					(click)="cancel()">
					Cancel
				</button>
				<button
					name="lm-a-moreicons-save"
					type="button"
					class="btn-modal-primary"
					(click)="save()">
					OK
				</button>
			</div>
		</div>
	`})],co);var pi;(function(m){m[m.Missing=1]="Missing",m[m.Invalid=2]="Invalid",m[m.Parent=3]="Parent"})(pi||(pi={}));var dd=m=>e=>{let t=e&&e.ly&&e.ly.areas&&e.ly.areas[m]||[],i=e&&e.cts||[],s=[];for(let a of t){let o=i.find(n=>n.eid===a.id);o&&s.push(o)}return s},Rs,po=(Rs=class extends R{constructor(e,t,i,s,a,o,n,r){super("DynamicPageEditor",n),this.pageService=e,this.dialogService=t,this.viewContainerRef=i,this.adminService=s,this.filterService=a,this.adminContext=o,this.settingsService=r,this.accessTitles={},this.dynContainerIdentifiers=ht,this.dynContainerTypes=k,this.dynColorTypes=ie,this.bannerQuery="",this.mainQuery="",this.policyQuery="",this.filter={type:{links:!1,shortcuts:!1,images:!1,items:!1,widgets:!1,webs:!1},access:{}},this.showRepair=!0,this.isEditable=!0,this.defaultTitle="Untitled",this.defaultAccessFiltersLimit=5,this.accessFiltersLimit=this.defaultAccessFiltersLimit,this.componentFilters$=this.filterService.componentFilters$,this.accessFilters$=this.filterService.accessFilters$,this.page=this.pageService.editedPage,this.noPolicyKey=x.noPolicyKey,this.allUsersText=x.allUsersText,this.repairMessageOptions={message:x.repairPageText,level:ze.Warning,dismissable:!0,actions:[{icon:"import",text:"Import policies",execute:()=>this.openImportPolicies()},{icon:"wrench",text:"Repair",execute:()=>this.repairPageAccess()}]},this.mainContainers=this.page.pipe(re(l=>this.isEditable=l&&!l.isReadOnly),N(dd("main"))),this.bannerContainers=this.page.pipe(N(dd("banner"))),this.settings=this.page.pipe(N(l=>{if(l){let c=[];for(let g of l.seto){let P=l.sets.find(z=>z.eid===g.id);P&&c.push(P)}return c}}),re(l=>{l&&(this.defaultSetting=l[l.length-1],this.defaultColor=le.numberToHexCode(this.defaultSetting.cl))})),this.accessErrorMap=this.pageService.evaluateAccess.pipe(dr(this.bannerContainers,this.mainContainers,this.settings),N(l=>{let c={parents:{},errors:{}},g=l[0],P=l[1],z=l[2],Z=l[3],me=(se,X,Be)=>{for(let ae of se){let sn=ae.ais;if(sn)for(let oa of sn){let Un=u.itemByProperty(g,"exid",oa);if(!Un||Un.ec){De(c.parents,X,{type:pi.Parent,aid:oa}),Be&&De(c.parents,Be,{type:pi.Parent,aid:oa});let Bd=Be?Be+ae.eid:ae.eid;De(c.errors,Bd,Un?{type:pi.Invalid,aid:oa}:{type:pi.Missing,aid:oa})}}ae.hds&&me(ae.hds,X,ae.eid),ae.ims&&me(ae.ims,X,ae.eid),ae.its&&me(ae.its,X,ae.eid),ae.ws&&me(ae.ws,X,ae.eid),ae.wbs&&me(ae.wbs,X,ae.eid),ae.txts&&me(ae.txts,X,ae.eid)}},De=(se,X,Be)=>{se[X]||(se[X]=[]),se[X].push(Be)};return me(P,"banner"),me(z,"main"),me(Z,"settings"),c}),Vt(1)),this.missingAccesses=this.accessErrorMap.pipe(N(l=>{let c=[];if(l){let g=l.errors;for(let P in g)g[P].forEach(Z=>{Z.type===pi.Missing&&!u.contains(c,Z.aid)&&c.push(Z.aid)})}return c})),this.headerWidth="100%",this.policyInvalidText=M.policyInvalidText,this.sortOptions={localeOptions:{}},this.experimentalTooltip=I.dynPageExperimentalFeatureMsg,this.unsubscribers=[],this.subscriptions=new nt,this.ViewOnlyModeHeader="View only mode",this.ViewOnlyModeSuffix=" in view only mode.",this.accessTitles=e.getAccessTitles(),this.initDefaults(o),this.subscriptions.add(this.settingsService.features$.subscribe(l=>{this.updateSettingControlledValues(l)}))}ngOnInit(){window.addEventListener("resize",this),this.unsubscribers.push(this.adminService.onAppMenuCollapsed().on(()=>{this.headerWidth="100%"})),this.unsubscribers.push(this.adminService.onAppMenuExpanded().on(e=>{setTimeout(()=>{this.handleResize()},e)})),this.handleResize(),this.pageService.nextEditorToggled(!0),this.pageService.saveStateChanged.subscribe(e=>{this.saveText=e}),this.pageService.filterEntityDeleted.subscribe(e=>{for(let t of e)delete this.filter[t.filterScope][t.filterEntity]})}ngAfterViewInit(){je(this.mainContainers,this.bannerContainers,this.settings).pipe(he(1),re(e=>{this.expandInitial(e)})).subscribe()}ngOnDestroy(){this.logDebug("ngOnDestroy"),window.removeEventListener("resize",this),this.unsubscribers.forEach(e=>{e()}),this.pageService.nextEditorToggled(!1),this.subscriptions.unsubscribe()}handleEvent(e){e.type==="resize"&&this.handleResize()}handleResize(){if(!this.handlingResize){this.handlingResize=!0;let e=this;setTimeout(()=>{let t=$("#lmAdmCnt").outerWidth();if(t>0)e.headerWidth=t+"px";else{let i=$("#application-menu"),s=i.css("display")==="none"?0:i.outerWidth();e.headerWidth=$(window).width()-s+"px"}e.handlingResize=!1},100)}}addSetting(){this.openAddEditSetting()}editSetting(e,t){t&&!x.hasAccess(e)||this.openAddEditSetting({setting:e,openPermissions:t})}openAddEditSetting(e){if(this.isSettingDialogOpen)return;this.isSettingDialogOpen=!0;let t=e?this.isEditable?"Edit":"View":"Add",i=this.dialogService.modal(At,this.viewContainerRef).id("dyn-p-settings-mdl").title(t+" Configuration");i.apply(s=>{s.modalDialog=i,s.isEdit=!!e,s.settings=e?e.setting:void 0,s.expressions=e?x.toExpressions(e.setting,this.accessTitles):void 0,s.editInfo=e,s.isEnabled=this.isEditable}).afterClose(()=>{this.isSettingDialogOpen=!1}).open()}add(e){let t=this.dialogService.modal(mi,this.viewContainerRef).title("Add Component").id("lm-dp-addcomp-dialog").buttons([{text:"Close",click:()=>t.close(),id:"lm-a-dp-ac-close-btn"}]).apply(i=>i.area=e).open()}close(){this.pageService.closeEditor()}deleteSetting(e){this.showConfirm("Confirm Delete","Are you sure that you want to delete the configuration?").subscribe(()=>{this.pageService.deleteSetting(e).pipe(G(()=>Y())).subscribe()})}openContainerSettings(e,t){let i=this.dialogService.modal(ks,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Settings`).id("dyn-p-cont-settings-mdl");i.apply(s=>{s.modalDialog=i,s.container=D({},e),s.isMainAreaContainer=t==="main",s.isEditable=this.isEditable}).open()}deleteContainer(e,t){let i=e.t||this.defaultTitle;this.showConfirm("Confirm Delete","Are you sure that you want to delete '"+i+"'?").subscribe(()=>{this.pageService.deleteContainer(e,t).pipe(G(()=>Y())).subscribe()})}editContainerAccess(e){let t=x.toExpressions(e,this.accessTitles),i=this.dialogService.modal(ot,this.viewContainerRef).title(`${this.isEditable?"Select":"View"} Security Policy`).id("lm-dp-cont-access-dialog").afterClose(s=>{if(s){let a=s.value,o=s.operator;if(a){let n=te(D({},e),{as:1,ais:x.toIds(a),op:o});this.pageService.updateContainer(n,e).pipe(G(()=>Y())).subscribe()}else t&&this.pageService.updateContainer(te(D({},e),{as:null,ais:null}),e).pipe(G(()=>Y())).subscribe()}});i.apply(s=>{s.modalDialog=i,s.listLabel="Choose which set of users this component should be visible for.",s.selectedExpressions=t,s.operator=e.op,s.showOperator=!0,s.isEditable=this.isEditable}).open()}repairPageAccess(){if(!this.isEditable){this.showMessage(this.ViewOnlyModeHeader,"Repair of policies is not allowed"+this.ViewOnlyModeSuffix);return}let t=this.pageService.getPage().pid;this.missingAccesses.pipe(he(1)).subscribe(i=>{if(i&&i.length){let s=this.dialogService.modal(qt,this.viewContainerRef).title("Repair Page").id("lm-dp-repair-dialog").afterClose(a=>{a&&a.value&&a.value===Q.Success&&this.pageService.editPage(t).subscribe(()=>this.accessTitles=this.pageService.getAccessTitles())});s.apply(a=>{a.modalDialog=s,a.operation=this.pageService.repairPage(t,i),a.initialMessage="Starting repair operation..."}).open()}else this.showError("Unable to repair","There are no missing security policies.")})}openImportPolicies(){this.isEditable?this.adminService.openPolicyImportDialog(this.viewContainerRef).subscribe():this.showMessage(this.ViewOnlyModeHeader,"Import of policies is not allowed"+this.ViewOnlyModeSuffix)}preview(){this.pageService.preview()}previewAsUser(){this.getPreviewer().previewAsUser()}previewAsPolicy(){this.getPreviewer().previewAsPolicy()}onComponentDropped(e){let t;switch(e.type){case k.Links:t=this.pageService.addLinkList(e.area,e.subType,e.index);break;case k.Image:t=this.pageService.addImage(e.area,e.index);break;case k.Items:t=this.pageService.addItems(e.area,e.index);break;case k.Widget:t=this.pageService.addWidget(e.area,e.index);break;case k.Web:t=this.pageService.addWeb(e.area,e.index);break;case k.Text:t=this.pageService.addText(e.area,e.index);break;default:this.logError(`Invalid container type: ${e.type}`);return}t.pipe(G(()=>Y())).subscribe()}collapseAll(){let e=this.accordions.toArray(),t=i=>{let s=e.find(a=>a.entity===i);s&&s.collapse()};t("main"),this.showBannerArea&&t("banner")}expandInitial(e){let t=!e[1].length,i=!e[0].length;t&&i&&e[2].length===1?this.expandMainArea():(t||this.expandBannerArea(),i||this.expandMainArea())}expandMainArea(){this.accordions.toArray()[2].expand()}expandBannerArea(){this.accordions.toArray()[1].expand()}expandSettings(){this.accordions.toArray()[0].expand()}trackContainersBy(e,t){return t.eid}onSortStart(e){this.sortStartInfo=e}updateLayout(e){let t=this.sortStartInfo;this.page.pipe(he(1),N(s=>{let a=s.ly.areas,o=a[t.area],n=e.area;if(n){let r=o[t.index];if(r)this.validateAreaTarget(s,r,n),a[n]?a[n].splice(e.index,0,r):a[n]=[r],o.splice(t.index,1);else throw new Error("No entry")}else if(o.length>1)u.move(o,this.sortStartInfo.index,e.index);else throw new Error("No sort changes");return s}),la(s=>this.pageService.updatePage(s)),G(()=>(i(e),Y()))).subscribe(()=>{e.area&&this.pageService.nextEvaluateAccess()});function i(s){s.element?s.element.sortable("cancel"):this.sortStartInfo.element.sortable("cancel")}}updateSettingsOrder(e){let t=this.pageService.getPageClone();u.move(t.sets,this.sortStartInfo.index,e.index),this.pageService.updatePage(t).pipe(G(()=>(e.element.sortable("cancel"),Y()))).subscribe()}updateItemOrder(e,t){let i=v.copy(t),s=this.getContainerItems(i,e);u.move(s,this.sortStartInfo.index,e.index),this.pageService.updateContainer(i).pipe(G(()=>(e.element.sortable("cancel"),Y()))).subscribe()}getComponentTypeColor(e,t){let i="";switch(e){case k.Image:i="#f6d67b";break;case k.Links:{t===1?i="#c0ede3":i="#ede3fc";break}case k.Text:i="#f6b97b";break;case k.Items:i="#cbebf4";break;case k.Widget:i="#f4bcbc";break;case k.Web:i="#c0e8ac";break;default:this.logError(`Invalid container type ${e}`)}return i}getComponentTypeLabel(e,t){return x.getComponentTypeLabel(e,t)}getAccessText(e){return x.entityAccessText(e,this.accessTitles)}getAccessError(e){return x.entityErrorText(e.ais,this.accessTitles)}changeAccessFiltersLimit(){this.accessFiltersLimit===this.defaultAccessFiltersLimit?this.accessFiltersLimit=void 0:this.accessFiltersLimit=this.defaultAccessFiltersLimit}disableAccessFilter(e){let t=this.filter;t.access[e]=!1,this.filter=D({},t)}get showAllUsersFilter(){let e=this.policyQuery;return!e||this.allUsersText.toLowerCase().includes(e.toLowerCase())}getPreviewer(){return new ws(this.viewContainerRef,this.dialogService,this.adminService,this.pageService)}initDefaults(e){this.showBannerArea=!0;let t=e.get();t&&this.updateSettingControlledValues(t.settings)}updateSettingControlledValues(e){this.showBannerArea=!0}validateAreaTarget(e,t,i){if(x.isValidAreaTarget(e,t,i))return;throw this.showError("Unable to drop component","The component contains one or more widgets that are not allowed in the target area."),new Error("Invalid target "+i)}getContainerItems(e,t){switch(e.ct){case k.Links:return e.its;case k.Image:return e.ims;case k.Widget:return e.ws;case k.Web:return e.wbs;case k.Text:return e.txts;case k.Items:if(e.hds.length>0)if(this.sortStartInfo.index>e.hds.length-1){this.sortStartInfo.index-=e.hds.length;let i=t.index-e.hds.length;return t.index=i<0?this.sortStartInfo.index:i,e.its}else return t.index>e.hds.length-1&&(t.index=this.sortStartInfo.index),e.hds;else return e.its}}},Rs.ctorParameters=()=>[{type:F},{type:w},{type:A},{type:y},{type:Pn},{type:O},{type:b},{type:be}],Rs.propDecorators={accordions:[{type:wi,args:[Wt]}]},Rs);po=d([p({selector:"lm-dynamic-page-editor",template:id,styles:[sd,ad]})],po);var vo,ho=(vo=class{constructor(){this.onEdit=new V}ngOnInit(){let e=le.numberToHexCode(this.value),t=le.getPageColorPickerOptions().colors;this.colorInfo=u.itemByProperty(t,"value",e.substr(1))}editSetting(){this.onEdit.emit()}},vo.propDecorators={value:[{type:h}],onEdit:[{type:U}]},vo);ho=d([p({selector:"lm-dynamic-page-color",template:`<div
			class="img-icon"
			[style.background-color]="'#' + colorInfo.value"></div>
		<div class="img-text">
			<p name="lm-a-dp-color-name" (click)="editSetting()">
				{{ colorInfo.label }}
			</p>
		</div>`,styles:[od]})],ho);var xo,En=(xo=class{constructor(){this.filterChange=new V}ngOnDestroy(){this.filterScope==="type"&&(this.filter[this.filterScope][this.filterEntity]=!1,this.onFilterChange())}onFilterChange(){this.filterChange.emit(D({},this.filter))}},xo.propDecorators={label:[{type:h}],filterId:[{type:h}],filterScope:[{type:h}],filterEntity:[{type:h}],filter:[{type:h}],errorText:[{type:h}],icon:[{type:h}],filterChange:[{type:U}]},xo);En=d([p({selector:"filter-item",template:`
		<div class="field field-checkbox">
			<input
				soho-checkbox
				[id]="filterId"
				type="checkbox"
				(change)="onFilterChange()"
				[(ngModel)]="filter[filterScope][filterEntity]" />
			<label
				soho-label
				[attr.id]="filterId + '-label'"
				[attr.for]="filterId"
				[forCheckBox]="true"
				>{{ label }}</label
			>
			<svg
				soho-icon
				*ngIf="errorText"
				[attr.id]="filterId + '-error'"
				icon="alert"
				[alert]="true"
				soho-tooltip
				[content]="errorText"></svg>
			<svg
				soho-icon
				class="custom-icon lm-margin-sm-dir-l"
				*ngIf="icon"
				[icon]="icon"></svg>
		</div>
	`,changeDetection:Si.OnPush,styles:[nd]})],En);var So,uo=(So=class{constructor(e){this.element=$(e.nativeElement)}ngOnInit(){this.element.draggable({revert:"true",helper:"clone",containment:"#lmAdmCnt"})}},So.ctorParameters=()=>[{type:Ci}],So);uo=d([Ue({selector:"[draggable-component]"})],uo);var Ms,go=(Ms=class{constructor(e,t){this.zone=t,this.onDropped=new V,this.element=$(e.nativeElement)}ngOnInit(){this.element.droppable({drop:(e,t)=>{let i,s=0,a=t.draggable.attr("id");a===ht.LINK_LIST?i=k.Links:a===ht.SHORTCUT?(i=k.Links,s=1):a===ht.IMAGE?i=k.Image:a===ht.ITEMS?i=k.Items:a===ht.WIDGET?i=k.Widget:a===ht.WEB?i=k.Web:a===ht.TEXT&&(i=k.Text),this.zone.run(()=>{this.onDropped.emit({type:i,subType:s,area:this.area,index:this.dropIndex})})},accept:".draggable-component",tolerance:"intersect",greedy:!0})}},Ms.ctorParameters=()=>[{type:Ci},{type:B}],Ms.propDecorators={area:[{type:h}],dropIndex:[{type:h}],onDropped:[{type:U}]},Ms);go=d([Ue({selector:"[droppable-component]"})],go);var Ls,bo=(Ls=class{constructor(e,t){this.zone=t,this.isContainer=!1,this.onSortStart=new V,this.onComponentSorted=new V,this.element=$(e.nativeElement)}ngOnInit(){let e=this.element,t=this.isContainer,i=t?".container-wrapper":".list-item:not(.default-config)",s={axis:"y",items:t?`> ${i}`:i,cursor:"move",handle:t?"lm-dynamic-accordion-header > svg[icon='drag']":"svg[icon='drag']",start:(a,o)=>{let n=e.find(i).index(o.item);this.zone.run(()=>this.onSortStart.emit({element:e,index:n,area:this.area}))},update:(a,o)=>{let n=e.find(i).index(o.item);n>=0&&!o.sender&&this.zone.run(()=>this.onComponentSorted.emit({element:e,index:n}))}};t&&(s.receive=(a,o)=>{let n=e.find(i).index(o.item);this.zone.run(()=>this.onComponentSorted.emit({index:n,area:this.area}))},s.connectWith="lm-dynamic-accordion-pane[sortable-component][droppable-component]"),e.sortable(s)}},Ls.ctorParameters=()=>[{type:Ci},{type:B}],Ls.propDecorators={isContainer:[{type:h}],area:[{type:h}],onSortStart:[{type:U}],onComponentSorted:[{type:U}]},Ls);bo=d([Ue({selector:"[sortable-component]"})],bo);var fo=class{transform(e,t,i){let s,a;for(let n in t.type)if(t.type[n]){s=!0;break}for(let n in t.access)if(t.access[n]){a=!0;break}if(!s&&!a)return e;let o=t.type;return e.filter(n=>{if(this.isEntityAccess(n,t.access))return!0;let r=i||n,l=r.ct;if(l===k.Links&&r.st===wr.Shortcuts&&o.shortcuts||l===k.Links&&o.links&&!r.st||l===k.Image&&o.images||l===k.Items&&o.items||l===k.Widget&&o.widgets||l===k.Text&&o.texts||l===k.Web&&o.webs||a&&!i&&(this.isEntitiesAccess(r.ims,t.access)||this.isEntitiesAccess(r.its,t.access)||this.isEntitiesAccess(r.hds,t.access)||this.isEntitiesAccess(r.ws,t.access)||this.isEntitiesAccess(r.wbs,t.access)||this.isEntitiesAccess(r.txts,t.access)))return!0})}isEntitiesAccess(e,t){if(e){for(let i of e)if(this.isEntityAccess(i,t))return!0}return!1}isEntityAccess(e,t){let i=e.ais;if(i){for(let s of i)if(t[s])return!0}else return!!t[x.noPolicyKey];return!1}};fo=d([Ve({name:"refineBy"})],fo);var yo=class{transform(e,t,i){if(!t.length)return e;let s=n=>n&&n.toLowerCase().indexOf(t.toLowerCase())>=0,a=n=>{let r=n.ais;if(r){for(let l of r)if(s(i[l]))return!0}return!1},o=n=>{let r=s(n.t),l=a(n),c=s(n.u);return r||l||c};return e.filter(n=>{if(o(n))return!0;if(!!n.ct){let l=n,c=l.its||[];for(let P of c)if(o(P))return!0;let g=l.ims||[];for(let P of g)if(o(P))return!0}})}};yo=d([Ve({name:"searchFilter"})],yo);var Tn=class{transform(e,t){return t.length?e.filter(i=>i.t&&i.t.toLowerCase().indexOf(t.toLowerCase())>=0):e}};Tn=d([Ve({name:"searchPolicyFilter"})],Tn);var Pt=class Pt{};Pt.IMAGE="lm-a-dp-di",Pt.SHORTCUT="lm-a-dp-sc",Pt.LINK_LIST="lm-a-dp-dl",Pt.ITEMS="lm-a-dp-du",Pt.WIDGET="lm-a-dp-dw",Pt.WEB="lm-a-dp-wb",Pt.TEXT="lm-a-dp-tx";var ht=Pt;var ke=`.dynamic-list-row{display:flex;flex-direction:row;align-items:center}.dynamic-list-row p{font-size:12px}.dynamic-list-row p>span{cursor:pointer}.dynamic-list-row.list-header{padding:0 40px}.dynamic-list-row.list-header p{font-size:1.1rem}.dynamic-list-row.list-item{box-shadow:1px -1px 1px #0101011a;margin-top:8px}.dynamic-list-row.list-item.is-selected{background-color:#54a1d3!important}.dynamic-list-row.list-item.is-cut{opacity:.4}.dynamic-list-row.list-item.is-selected ::ng-deep div>p,.dynamic-list-row.list-item.is-selected ::ng-deep svg[icon=drag],.dynamic-list-row.list-item.is-selected ::ng-deep svg[icon=more],.dynamic-list-row.list-item.is-selected ::ng-deep .policy>p>svg[soho-icon]{color:#fff}.dynamic-list-row .dl-icon{flex:0 0 40px;padding-left:5px}.dynamic-list-row>.h1,.dynamic-list-row>.h2,.dynamic-list-row>.h3,.dynamic-list-row>.h4,.dynamic-list-row>.image-wrapper,.dynamic-list-row>.policy{flex:0 1 340px;padding-right:10px;min-width:0}.dynamic-list-row .image-wrapper{height:50px;width:125px;margin-top:10px;margin-bottom:10px;flex:0 1 340px;padding-right:10px;flex-grow:1;position:relative}.dynamic-list-row .image-wrapper .image{max-height:100%;cursor:pointer;position:absolute;top:50%;transform:translateY(-50%)}.dynamic-list-row .image-wrapper .none{font-style:italic}.dynamic-list-row>.h1{display:flex;flex-grow:1}.dynamic-list-row>.h1.content-type{flex:1 1 240px}.dynamic-list-row>.h1>p.normal-link{font-size:11px;padding-left:25px}.dynamic-list-row>.h1>.clt>.none{font-style:italic}.dynamic-list-row>.h2{flex-basis:240px}.dynamic-list-row>.h2.content{flex-basis:400px;display:flex;padding-right:20px}.dynamic-list-row>.h3{display:flex;flex-basis:240px}.dynamic-list-row>.h4{flex-basis:240px}.dynamic-list-row .policy p{display:flex;align-items:center}.dynamic-list-row .policy svg[soho-icon]{flex:0 0 auto;height:16px;width:16px;margin-right:5px}.dynamic-list-row .empty-input{font-style:italic}.dynamic-list-row .custom-color{width:10px;height:10px;margin:5px}.info-header h2{padding:5px 0}.add-button-container.empty{height:100px}.add-button-container:not(.empty){display:block}svg[icon=drag]{cursor:move}svg[icon=alert]{top:0;margin-left:5px}.clt-inherit{background:radial-gradient(transparent 57%,#1a1a1a 34%)}.dyn-icon svg{color:#fff}.dyn-icon.clt-inherit svg{color:#1a1a1a}[soho-menu-button].selection-actions{float:right;margin:0}:host-context(html[dir=rtl]) .dynamic-list-row .policy svg[soho-icon]{margin-left:5px;margin-right:0}:host-context(html[dir=rtl]) [soho-menu-button].selection-actions{float:left}
/*# sourceMappingURL=dynamic-container-list.css.map */
`;var cd=`<div\r
	class="dynamic-list-row list-item lm-item-bg"\r
	[class.is-selected]="isSelected"\r
	[class.is-cut]="isCut">\r
	<div class="dl-icon">\r
		<svg\r
			soho-icon\r
			[attr.name]="itemAutoIdentifier + '-select-handle'"\r
			[attr.data-lm-a-dp-item-select-btn]="uniqueId"\r
			icon="drag"\r
			(click)="onSelected($event)"></svg>\r
	</div>\r
	<div class="image-wrapper" *ngIf="isImageComponent">\r
		<img\r
			broken-image-fallback\r
			[attr.name]="itemAutoIdentifier + '-img-thumb'"\r
			[attr.data-lm-a-dp-img-thumb]="uniqueId"\r
			[default]="imageFallback"\r
			[src]="imgUrl"\r
			(click)="editItem.emit()"\r
			class="image" />\r
	</div>\r
	<div class="h1" [class.content-type]="isContent" *ngIf="isHeaderColorBar">\r
		<ng-container *ngIf="h1">\r
			<span\r
				*ngIf="icon"\r
				[attr.data-lm-a-dp-item-icon]="uniqueId"\r
				[attr.name]="itemAutoIdentifier + '-iconcont'"\r
				class="dyn-icon"\r
				[class.clt-inherit]="isColorTypeInherit"\r
				[style.background-color]="\r
					isColorTypeCustom ? (iconColor | lmColorNumberToHexExtended) : '#fff'\r
				">\r
				<svg\r
					class="icon"\r
					[attr.name]="itemAutoIdentifier + '-h1icon'"\r
					focusable="false">\r
					<use [attr.xlink:href]="icon"></use>\r
				</svg>\r
			</span>\r
			<p class="lm-truncate-text" [class.normal-link]="isNormal">\r
				<span\r
					[attr.name]="itemAutoIdentifier + '-h1'"\r
					[attr.data-lm-a-dp-item-h1]="uniqueId"\r
					(click)="editItem.emit()"\r
					>{{ h1 }}</span\r
				>\r
			</p>\r
		</ng-container>\r
		<ng-container *ngIf="isItemContainer">\r
			<p class="lm-truncate-text" *ngIf="isHeader">\r
				<span\r
					[attr.name]="itemAutoIdentifier + '-colortype'"\r
					(click)="editItem.emit()"\r
					[attr.data-lm-a-dp-item-clt]="uniqueId"\r
					[class.empty-input]="isColorTypeNone"\r
					>{{ clt | lmGetColorTypeName }}</span\r
				>\r
			</p>\r
			<span\r
				*ngIf="isHeaderWithCustomColor"\r
				class="custom-color"\r
				[style.background-color]="\r
					customColor | lmColorNumberToHexExtended\r
				"></span>\r
			<p class="lm-truncate-text" *ngIf="isContent">\r
				<span\r
					*ngIf="!isLinebreak"\r
					[attr.name]="itemAutoIdentifier + '-type'"\r
					[attr.data-lm-a-dp-item-type]="uniqueId"\r
					(click)="editItem.emit()"\r
					>{{ it | lmGetContentTypeName }}</span\r
				>\r
				<span style="cursor: default" *ngIf="isLinebreak">Line break</span>\r
			</p>\r
		</ng-container>\r
	</div>\r
	<div class="h2" [class.content]="isContent">\r
		<ng-container *ngIf="isHeader">\r
			<div class="image-wrapper" *ngIf="imgUrl">\r
				<img\r
					broken-image-fallback\r
					[attr.name]="itemAutoIdentifier + '-img-thumb'"\r
					[attr.data-lm-a-dp-img-thumb]="uniqueId"\r
					[default]="imageFallback"\r
					[src]="imgUrl"\r
					class="image"\r
					(click)="editItem.emit()" />\r
			</div>\r
			<p\r
				*ngIf="!imgUrl"\r
				[attr.data-lm-a-dp-img-none]="uniqueId"\r
				class="lm-truncate-text">\r
				<span\r
					[attr.name]="itemAutoIdentifier + '-image-none'"\r
					class="empty-input"\r
					(click)="editItem.emit()"\r
					>None</span\r
				>\r
			</p>\r
		</ng-container>\r
\r
		<ng-container *ngIf="isContent">\r
			<span\r
				*ngIf="icon"\r
				[attr.name]="itemAutoIdentifier + '-icon'"\r
				[attr.data-lm-a-dp-item-icon]="uniqueId"\r
				class="dyn-icon"\r
				[class.clt-inherit]="isColorTypeInherit"\r
				[style.background-color]="\r
					isColorTypeCustom ? (iconColor | lmColorNumberToHexExtended) : '#fff'\r
				">\r
				<svg class="icon" focusable="false">\r
					<use [attr.xlink:href]="icon"></use>\r
				</svg>\r
			</span>\r
			<p *ngIf="isContentEmpty" class="lm-truncate-text">\r
				<span\r
					class="empty-input"\r
					[attr.name]="itemAutoIdentifier + '-icon-none'"\r
					[attr.data-lm-a-dp-item-icon-none]="uniqueId"\r
					(click)="editItem.emit()"\r
					>None</span\r
				>\r
			</p>\r
		</ng-container>\r
		<p *ngIf="h2" class="lm-truncate-text">\r
			<span\r
				[attr.name]="itemAutoIdentifier + '-h2'"\r
				[attr.data-lm-a-dp-item-h2]="uniqueId"\r
				(click)="editItem.emit()"\r
				>{{ h2 }}</span\r
			>\r
		</p>\r
	</div>\r
	<div class="h3" *ngIf="isItemContainer || h3">\r
		<p class="lm-truncate-text">\r
			<span\r
				*ngIf="h3"\r
				[attr.name]="itemAutoIdentifier + '-h3'"\r
				[attr.data-lm-a-dp-item-h3]="uniqueId"\r
				(click)="editItem.emit()"\r
				>{{ h3 }}</span\r
			>\r
			<span\r
				*ngIf="isEmptyTextContent || isEmptyHeaderHeading"\r
				[attr.name]="itemAutoIdentifier + '-h3-none'"\r
				[attr.data-lm-a-dp-item-h3-none]="uniqueId"\r
				class="empty-input"\r
				(click)="editItem.emit()"\r
				>None</span\r
			>\r
		</p>\r
		<span\r
			*ngIf="isLinkWithCustomColor"\r
			class="custom-color"\r
			[style.background-color]="iconColor | lmColorNumberToHexExtended"></span>\r
	</div>\r
	<div class="h4" *ngIf="isHeader">\r
		<p class="lm-truncate-text">\r
			<span\r
				*ngIf="h4"\r
				[attr.name]="itemAutoIdentifier + '-h4'"\r
				[attr.data-lm-a-dp-item-h4]="uniqueId"\r
				(click)="editItem.emit()"\r
				>{{ h4 }}</span\r
			>\r
			<span\r
				*ngIf="!h4"\r
				[attr.name]="itemAutoIdentifier + '-h4-none'"\r
				[attr.data-lm-a-dp-item-h4-none]="uniqueId"\r
				class="empty-input"\r
				(click)="editItem.emit()"\r
				>None</span\r
			>\r
		</p>\r
	</div>\r
	<div class="policy" *ngIf="!isLinebreak">\r
		<p>\r
			<svg\r
				soho-icon\r
				[attr.name]="itemAutoIdentifier + '-access-icon'"\r
				[icon]="ais ? 'locked' : 'url'"\r
				class="lm-cursor-pointer"\r
				(click)="editItem.emit(true)"></svg>\r
			<span\r
				class="lm-truncate-text"\r
				[attr.name]="itemAutoIdentifier + '-access-text'"\r
				[attr.data-lm-a-dp-item-accs]="uniqueId"\r
				(click)="editItem.emit(true)"\r
				>{{ accessValueText }}</span\r
			>\r
			<svg\r
				soho-icon\r
				[attr.name]="itemAutoIdentifier + '-access-error'"\r
				icon="alert"\r
				[alert]="true"\r
				*ngIf="accessErrorText"\r
				soho-tooltip\r
				[content]="accessErrorText"></svg>\r
		</p>\r
	</div>\r
	<div class="dl-icon" *ngIf="!isLinebreak">\r
		<button\r
			soho-context-menu\r
			[name]="itemAutoIdentifier + '-menu-button'"\r
			[attr.data-lm-a-dp-item-embtn]="uniqueId"\r
			trigger="click"\r
			[menu]="popupId"\r
			class="btn-actions lm-margin-sm-r">\r
			<svg soho-icon icon="more"></svg>\r
		</button>\r
		<ul soho-popupmenu [id]="popupId">\r
			<li soho-popupmenu-item>\r
				<a\r
					soho-popupmenu-label\r
					[name]="itemAutoIdentifier + '-edit'"\r
					[attr.data-lm-a-dp-item-edit]="uniqueId"\r
					(click)="editItem.emit()">\r
					{{ isEditable ? "Edit" : "View" }}\r
				</a>\r
			</li>\r
			<li soho-popupmenu-item *ngIf="isEditable">\r
				<a\r
					soho-popupmenu-label\r
					[name]="itemAutoIdentifier + '-delete'"\r
					[attr.data-lm-a-dp-item-dlt]="uniqueId"\r
					(click)="deleteItem.emit()">\r
					Delete\r
				</a>\r
			</li>\r
			<li soho-popupmenu-item *ngIf="canDuplicate">\r
				<a\r
					soho-popupmenu-label\r
					[name]="itemAutoIdentifier + '-duplicate'"\r
					[attr.data-lm-a-dp-item-dup]="uniqueId"\r
					(click)="duplicateItem.emit()">\r
					Duplicate\r
				</a>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="dl-icon" *ngIf="isLinebreak && isEditable">\r
		<button\r
			[name]="itemAutoIdentifier + '-linebreak-delete'"\r
			[attr.data-lm-a-dp-item-lbdlt]="uniqueId"\r
			(click)="deleteItem.emit()"\r
			class="btn-actions">\r
			<svg soho-icon icon="delete"></svg>\r
		</button>\r
	</div>\r
</div>\r
`;var Bs,Ns=(Bs=class{constructor(e){this.pageService=e,this.clt=1,this.it=1,this.isEditable=!0,this.deleteItem=new V,this.editItem=new V,this.duplicateItem=new V,this.updateSelection=new V,this.popupId=`lm-a-dp-lm-${W.random()}`,this.colorTypes=ie,this.contentTypes=ge,this.imageFallback=I.dynBrokenImageFallback,this.accessTitles=e.getAccessTitles()}ngOnInit(){this.isHeaderWithCustomColor=this.clt===this.colorTypes.Custom&&this.isHeader,this.isColorTypeCustom=this.clt===this.colorTypes.Custom,this.isColorTypeNone=this.clt===this.colorTypes.None,this.isColorTypeInherit=this.clt===this.colorTypes.InheritPage||this.clt===this.colorTypes.InheritParent,this.isImageComponent=this.imgUrl&&!this.isHeader,this.isHeaderColorBar=!this.imgUrl||this.isHeader,this.isItemContainer=this.isContent||this.isHeader,this.isEmptyTextContent=!this.h3&&this.it===this.contentTypes.Text,this.isEmptyHeaderHeading=!this.h3&&this.isHeader,this.isLinkWithCustomColor=this.h3&&this.it===this.contentTypes.Link&&this.isColorTypeCustom&&!this.isHeader,this.isContentEmpty=!this.h2&&this.it!==this.contentTypes.Linebreak,this.isLinebreak=this.it===this.contentTypes.Linebreak,this.uniqueId=`${this.parentId}-${this.eid}`,this.isEditable||(this.canDuplicate=!1),this.setAccessInfo(),this.setAutomationId()}onSelected(e){this.isEditable&&this.updateSelection.emit({shiftKey:e.shiftKey,ctrlKey:e.ctrlKey||e.metaKey})}setSelected(e){this.isSelected=e}setCut(e){this.isCut=e}setAccessInfo(){let e,t=x.allUsersText,i=this.ais;i&&(this.accessErrors&&this.accessErrors.errors[this.parentId+this.eid]&&(e=x.entityErrorText(i,this.accessTitles)),t=x.idsAccessText(i,this.accessTitles)),this.accessValueText=t,this.accessErrorText=e}setAutomationId(){this.itemAutoIdentifier=this.automationIdentifier+"-item"}},Bs.ctorParameters=()=>[{type:F}],Bs.propDecorators={h1:[{type:h}],clt:[{type:h}],it:[{type:h}],h2:[{type:h}],h3:[{type:h}],h4:[{type:h}],icon:[{type:h}],iconColor:[{type:h}],isNormal:[{type:h}],ais:[{type:h}],eid:[{type:h}],imgUrl:[{type:h}],isContent:[{type:h}],isHeader:[{type:h}],canDuplicate:[{type:h}],customColor:[{type:h}],accessErrors:[{type:h}],parentId:[{type:h}],isEditable:[{type:h}],automationIdentifier:[{type:h}],deleteItem:[{type:U}],editItem:[{type:U}],duplicateItem:[{type:U}],updateSelection:[{type:U}]},Bs);Ns=d([p({selector:"lm-dynamic-list-item",template:cd,styles:[ke]})],Ns);var Co=class{transform(e){switch(e){case ge.Link:return"Link";case ge.Attribute:return"User property";case ge.Text:return"Text";default:return""}}};Co=d([Ve({name:"lmGetContentTypeName"})],Co);var Io=class{transform(e){switch(e){case ie.None:return"None";case ie.InheritPage:return"Page color";case ie.Custom:return"Custom color";case ie.InheritParent:return"Component icon color";default:return""}}};Io=d([Ve({name:"lmGetColorTypeName"})],Io);var Ge=`<p *ngIf="isExperimental" class="lm-padding-md-b">\r
	<svg soho-icon icon="formula-constituents" class="lm-height-lg"></svg>\r
	<small class="text-descriptive">{{ experimentalTooltip }}</small>\r
</p>\r
<div class="info-header" *ngIf="infoHeader && !isEmpty">\r
	<h2>{{ infoHeader.title }}</h2>\r
	<label>{{ infoHeader.text }}</label>\r
</div>\r
\r
<div class="dynamic-list-row list-header" *ngIf="!isEmpty">\r
	<div class="h1" [class.content-type]="isContent">\r
		<p>{{ h1 }}</p>\r
	</div>\r
	<div class="h2" [class.content]="isContent" *ngIf="h2">\r
		<p>{{ h2 }}</p>\r
	</div>\r
	<div class="h3" *ngIf="h3">\r
		<p>{{ h3 }}</p>\r
	</div>\r
	<div class="h4" *ngIf="h4">\r
		<p>{{ h4 }}</p>\r
	</div>\r
	<div class="policy">\r
		<p>Applies to</p>\r
	</div>\r
</div>\r
\r
<ng-container\r
	*ngIf="!(isHeader || isContent) && container.its && container.its.length">\r
	<lm-dynamic-list-item\r
		*ngFor="\r
			let link of container.its\r
				| refineBy: filter : container\r
				| searchFilter: query : accessTitles;\r
			let i = index\r
		"\r
		[h1]="link.t"\r
		[icon]="link.i"\r
		[iconColor]="link.cl"\r
		[isNormal]="link.sz === linkSizes.Normal && !isShortcut"\r
		[h2]="link.u"\r
		[h3]="link.clt || colorTypes.Custom | lmGetColorTypeName"\r
		[clt]="link.clt || colorTypes.Custom"\r
		[ais]="link.ais"\r
		[eid]="link.eid"\r
		[canDuplicate]="true"\r
		[parentId]="container.eid"\r
		[accessErrors]="accessErrors"\r
		(updateSelection)="updateSelection($event, i)"\r
		(editItem)="editItem($event, link)"\r
		(deleteItem)="deleteItem(link)"\r
		(duplicateItem)="duplicateItem(link)"\r
		[isEditable]="isEditable"\r
		[automationIdentifier]="automationIdentifier">\r
	</lm-dynamic-list-item>\r
</ng-container>\r
\r
<ng-container *ngIf="container.ims && container.ims.length">\r
	<lm-dynamic-list-item\r
		*ngFor="\r
			let image of container.ims\r
				| refineBy: filter : container\r
				| searchFilter: query : accessTitles;\r
			let i = index\r
		"\r
		[h2]="alignment[image.al] || 'Fill'"\r
		[imgUrl]="image.u"\r
		[ais]="image.ais"\r
		[eid]="image.eid"\r
		[parentId]="container.eid"\r
		[accessErrors]="accessErrors"\r
		(updateSelection)="updateSelection($event, i)"\r
		(editItem)="editItem($event, image)"\r
		(deleteItem)="deleteItem(image)"\r
		[isEditable]="isEditable"\r
		[automationIdentifier]="automationIdentifier">\r
	</lm-dynamic-list-item>\r
</ng-container>\r
\r
<ng-container *ngIf="container.ws && container.ws.length">\r
	<lm-dynamic-list-item\r
		*ngFor="\r
			let item of container.ws\r
				| refineBy: filter : container\r
				| searchFilter: query : accessTitles;\r
			let i = index\r
		"\r
		[h1]="item.t"\r
		[ais]="item.ais"\r
		[eid]="item.eid"\r
		[parentId]="container.eid"\r
		[accessErrors]="accessErrors"\r
		(updateSelection)="updateSelection($event, i)"\r
		(editItem)="editItem($event, item)"\r
		(deleteItem)="deleteItem(item)"\r
		[isEditable]="isEditable"\r
		[automationIdentifier]="automationIdentifier">\r
	</lm-dynamic-list-item>\r
</ng-container>\r
\r
<ng-container *ngIf="container.wbs && container.wbs.length">\r
	<lm-dynamic-list-item\r
		*ngFor="\r
			let web of container.wbs\r
				| refineBy: filter : container\r
				| searchFilter: query : accessTitles;\r
			let i = index\r
		"\r
		[h1]="web.u"\r
		[h2]="(web.er && 'Refresh') || (web.lu && 'Launch') || 'None'"\r
		[ais]="web.ais"\r
		[eid]="web.eid"\r
		[parentId]="container.eid"\r
		[accessErrors]="accessErrors"\r
		(updateSelection)="updateSelection($event, i)"\r
		(editItem)="editItem($event, web)"\r
		(deleteItem)="deleteItem(web)"\r
		[isEditable]="isEditable"\r
		[automationIdentifier]="automationIdentifier">\r
	</lm-dynamic-list-item>\r
</ng-container>\r
\r
<ng-container *ngIf="container.txts && container.txts.length">\r
	<lm-dynamic-list-item\r
		*ngFor="\r
			let text of container.txts\r
				| refineBy: filter : container\r
				| searchFilter: query : accessTitles;\r
			let i = index\r
		"\r
		[h1]="text.tx"\r
		[ais]="text.ais"\r
		[eid]="text.eid"\r
		[parentId]="container.eid"\r
		[accessErrors]="accessErrors"\r
		(updateSelection)="updateSelection($event, i)"\r
		(editItem)="editItem($event, text)"\r
		(deleteItem)="deleteItem(text)"\r
		[isEditable]="isEditable"\r
		[automationIdentifier]="automationIdentifier">\r
	</lm-dynamic-list-item>\r
</ng-container>\r
\r
<ng-container *ngIf="isHeader || isContent">\r
	<ng-container *ngIf="isHeader && container.hds && container.hds.length">\r
		<lm-dynamic-list-item\r
			*ngFor="\r
				let header of container.hds\r
					| refineBy: filter : container\r
					| searchFilter: query : accessTitles\r
			"\r
			[isHeader]="true"\r
			[clt]="header.clt"\r
			[customColor]="header.cl"\r
			[imgUrl]="header.im?.u || null"\r
			[h3]="header.h1"\r
			[h4]="header.h2"\r
			[ais]="header.ais"\r
			[eid]="header.eid"\r
			[parentId]="container.eid"\r
			[accessErrors]="accessErrors"\r
			[canDuplicate]="true"\r
			(editItem)="editItem($event, header)"\r
			(deleteItem)="deleteItem(header)"\r
			(duplicateItem)="duplicateItem(header, true)"\r
			[isEditable]="isEditable"\r
			[automationIdentifier]="automationIdentifier">\r
		</lm-dynamic-list-item>\r
	</ng-container>\r
	<ng-container *ngIf="isContent && container.its && container.its.length">\r
		<lm-dynamic-list-item\r
			*ngFor="\r
				let content of container.its\r
					| refineBy: filter : container\r
					| searchFilter: query : accessTitles\r
			"\r
			[isContent]="true"\r
			[it]="content.it"\r
			[h2]="content.t"\r
			[h3]="content.l"\r
			[icon]="content.i"\r
			[iconColor]="content.cl"\r
			[clt]="content.clt || colorTypes.Custom"\r
			[ais]="content.ais"\r
			[eid]="content.eid"\r
			[parentId]="container.eid"\r
			[accessErrors]="accessErrors"\r
			[canDuplicate]="true"\r
			(editItem)="editItem($event, content)"\r
			(deleteItem)="deleteItem(content)"\r
			(duplicateItem)="duplicateItem(content)"\r
			[isEditable]="isEditable"\r
			[automationIdentifier]="automationIdentifier">\r
		</lm-dynamic-list-item>\r
	</ng-container>\r
</ng-container>\r
\r
<ng-container *ngIf="container.ct !== 4 && isEmpty">\r
	<div class="add-button-container empty" [class.lm-margin-md-t]="!isEmpty">\r
		<p *ngIf="addItemMessage">{{ addItemMessage }}</p>\r
		<div *ngIf="addItemText">\r
			<button\r
				soho-button="primary"\r
				[name]="automationIdentifier + '-addempty-button'"\r
				[attr.data-lm-a-dp-addempty-btn]="container.eid"\r
				icon="add"\r
				[disabled]="!isEditable"\r
				(click)="addItem()">\r
				{{ addItemText }}\r
			</button>\r
			<button\r
				*ngIf="showPaste$ | async"\r
				[name]="automationIdentifier + '-pasteempty-button'"\r
				[attr.data-lm-a-dp-pasteempty-btn]="container.eid"\r
				soho-button="secondary"\r
				[disabled]="!isEditable"\r
				icon="paste"\r
				(click)="pasteEntities()">\r
				Paste\r
			</button>\r
		</div>\r
	</div>\r
</ng-container>\r
\r
<ng-container\r
	*ngIf="!isEmpty || ((isContent || isHeader) && !itemContainerEmpty)">\r
	<div class="add-button-container lm-margin-md-t">\r
		<button\r
			soho-button="tertiary"\r
			[name]="automationIdentifier + '-add-button'"\r
			[attr.data-lm-a-dp-add-btn]="container.eid"\r
			icon="add"\r
			[disabled]="!isEditable"\r
			*ngIf="!isContent"\r
			(click)="isHeader ? addHeader() : addItem()">\r
			{{ addItemText }}\r
		</button>\r
		<lm-dyn-info-menu-btn\r
			*ngIf="isContent"\r
			[attr.name]="automationIdentifier + '-addempty-button'"\r
			[menuId]="'lm-a-d-in-m-' + container.eid"\r
			[entity]="container.eid"\r
			[isEditable]="isEditable"\r
			(selected)="addContent($event)"></lm-dyn-info-menu-btn>\r
		<button\r
			soho-button="tertiary"\r
			[name]="automationIdentifier + 'add-linebreak-button'"\r
			[attr.data-lm-a-dp-break-btn]="container.eid"\r
			*ngIf="isContent && isEditable"\r
			icon="add"\r
			(click)="addLineBreak()">\r
			Add Line Break\r
		</button>\r
		<button\r
			soho-button="tertiary"\r
			[name]="automationIdentifier + '-paste-button'"\r
			[attr.data-lm-a-dp-paste-btn]="container.eid"\r
			*ngIf="isEditable && (showPaste$ | async)"\r
			icon="paste"\r
			(click)="pasteEntities()">\r
			Paste\r
		</button>\r
		<button\r
			soho-menu-button\r
			[name]="automationIdentifier + '-actions-button'"\r
			[class.lm-display-none]="!selectionCount"\r
			class="btn-primary selection-actions"\r
			[menu]="'lm-a-dp-item-actions' + container.eid"\r
			type="button"\r
			[id]="'lm-a-dp-item-actions-btn' + container.eid">\r
			<span>Actions</span>\r
		</button>\r
		<ul\r
			soho-popupmenu\r
			[attr.name]="automationIdentifier + '-actions-menu'"\r
			[id]="'lm-a-dp-item-actions' + container.eid">\r
			<li soho-popupmenu-item>\r
				<a\r
					soho-popupmenu-label\r
					[name]="automationIdentifier + '-item-action-copy'"\r
					(click)="onCopy()"\r
					>Copy ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item>\r
				<a\r
					soho-popupmenu-label\r
					[name]="automationIdentifier + '-action-cut'"\r
					(click)="onCut()"\r
					>Cut ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-separator></li>\r
			<li soho-popupmenu-item>\r
				<a\r
					soho-popupmenu-label\r
					[name]="automationIdentifier + '-action-delete'"\r
					(click)="onDeleteSelected()"\r
					>Delete ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
</ng-container>\r
`;var md=`<div style="width: 550px">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aei-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aei-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<div class="field">\r
				<label class="required">URL</label>\r
				<input\r
					[(ngModel)]="image.u"\r
					id="lm-a-dp-aei-url-inp"\r
					[maxlength]="urlMaxLength"\r
					data-validate="required"\r
					(ngModelChange)="setIsSaveDisabled()" />\r
			</div>\r
			<div class="field">\r
				<label soho-label>Alignment</label>\r
				<select\r
					soho-dropdown\r
					name="lm-a-dp-aei-alignment-drpd"\r
					[attributes]="{ name: 'id', value: 'lm-a-dp-aei-alignment' }"\r
					[(ngModel)]="image.al">\r
					<option id="lm-a-dp-aei-alignment-fill" [value]="alignment.Fill">\r
						Fill\r
					</option>\r
					<option id="lm-a-dp-aei-alignment-center" [value]="alignment.Center">\r
						Center\r
					</option>\r
					<option id="lm-a-dp-aei-alignment-fit" [value]="alignment.Fit">\r
						Fit\r
					</option>\r
					<option id="lm-a-dp-aei-alignment-cover" [value]="alignment.Cover">\r
						Cover\r
					</option>\r
				</select>\r
			</div>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="image.op"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aei-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aei-save-btn"\r
			class="btn-modal-primary no-validation"\r
			(click)="save()"\r
			[disabled]="isSaveDisabled">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var wo,kn=(wo=class extends R{constructor(e){super("DynamicClipboardService"),this.toastService=e,this.clipboardTypeSubject=new gt(1),this.clipboardTypeInfo$=this.clipboardTypeSubject.asObservable()}setClipboard(e){this.clipboardInfo=e,this.clipboardTypeSubject.next({ct:e.ct,st:e.st}),this.showToastNotification(!!e.originId)}getClipboard(){return this.clipboardInfo}clearClipboard(){this.clipboardInfo=null,this.clipboardTypeSubject.next(null)}showToastNotification(e){let t=this.clipboardInfo.items.length,i=t===1?"item":"items";this.toastService.show({title:e?"Cut":"Copy",message:`${t} ${i} ${e?"cut":"copied"} to the Clipboard`,position:Ie.BOTTOM_RIGHT,timeout:2e3})}},wo.ctorParameters=()=>[{type:Ie}],wo);kn=d([ye({providedIn:"root"})],kn);var Us,Pe=(Us=class{get isEmpty(){return this._isEmpty}set isEmpty(e){this._isEmpty=e}constructor(e,t,i,s,a,o){this.viewContainerRef=e,this.dialogService=t,this.pageService=i,this.lazyTypeService=s,this.messageService=a,this.clipboardService=o,this.listItems=new cr,this.colorTypes=ie,this.selectionCount=0,this.componentLabel="item",this.automationIdentifier="lm-a-dp",this.popupId=`lm-a-dp-im-${W.random()}`,this.showPaste$=this.clipboardService.clipboardTypeInfo$.pipe(re(n=>{n||this.clearSelection()}),N(n=>n&&n.ct===this.container.ct&&n.st===this.container.st)),this.experimentalTooltip=I.dynPageExperimentalFeatureMsg,this._isEmpty=!0,this.maxSelected=10}clearClipboard(){this.clearCut(),this.clearSelection(),this.clipboardService.clearClipboard()}initItems(e,t,i,s,a,o){this.addItemText=e,this.addItemMessage=t,this.h1=i,this.h2=s,a&&(this.h3=a),o&&(this.h4=o),this.container?.ct&&(this.componentLabel=x.getComponentTypeLabel(this.container.ct,this.container.st),this.automationIdentifier="lm-a-dp-"+this.area+"-"+ue.formatTextForId(this.componentLabel,"component"))}canAdd(e){if(!this.isEditable)return!1;let t=I.dynMaxEntitiesInContainer;return this.getEntityCount()<t?!0:(this.messageService.message({title:`Unable to ${e?"duplicate":"add"} item`,message:`The max limit has been reached (${t}).`,buttons:[{text:"OK",id:"lm-a-dp-maxlimit-message-ok",click:(a,o)=>{o.close(!0)},isDefault:!0}],attributes:{name:"id",value:"lm-a-dp-maxlimit-message"}}).open(),!1)}addItem(){}editItem(e,t){}deleteItems(e,t){}duplicateItem(e,t){if(!this.canAdd(!0))return;let i=this.container,s=v.copy(e);s.eid=x.getNewEntityId(i);let a=v.copy(i);this.pageService.addContainerEntity(a,s,t).pipe(G(()=>Y())).subscribe()}updateSelection(e,t){e.shiftKey||(this.shiftSelectAnchor=t);let i=0;this.listItems.forEach((l,c)=>{s(c,l,this.shiftSelectAnchor)&&i<this.maxSelected?(l.setSelected(!0),i++):l.setSelected(!1)}),this.selectionCount=i;function s(l,c,g){return a(l,c.isSelected)||o(l,c.isSelected)||n(l,g)}function a(l,c){return t===l&&!c}function o(l,c){return e.ctrlKey&&c&&t!==l}function n(l,c){return e.shiftKey&&(r(l,c)||l===c)}function r(l,c){return l>=Math.min(c,t)&&l<=Math.max(c,t)}}copySelected(e){let t=this.getSelectedItems();this.setClipboardInfo(e,t),this.clearCut()}cutSelected(e){let t=this.getSelectedItems();this.setClipboardInfo(e,t,this.container.eid);for(let i of t)i.setCut(!0)}pasteEntities(){let e=this.clipboardService.getClipboard(),t=e.items,i=this.container;if(s()){let a=this.getEntityCount(),o=I.dynMaxEntitiesInContainer,n=t.filter(()=>(a++,a<=o)),r=e.lzn;n.length<t.length&&(r=this.getLznForItems(n,e.lzn)),this.pageService.addContainerEntityCopies(i,n,r).subscribe(()=>{this.isEmpty=!1,e.originId&&this.deleteCutItems(),this.clipboardService.clearClipboard()})}function s(){return t&&t.length&&e.ct===i.ct&&e.st===i.st}}clearSelectionCount(){this.selectionCount=0}deleteItem(e){this.deleteItems([e])}deleteSelectedItems(e){let t=this.listItems.filter(s=>s.isSelected),i=e.filter(s=>s.eid&&t.some(a=>a.eid===s.eid));this.deleteItems(i)}deleteCutItems(){let e=this.clipboardService.getClipboard(),t=this.pageService.getPage().cts.find(i=>i.eid===e.originId);t&&this.deleteItems(e.items,t)}getLznForItems(e,t){let i=v.copy(t);for(let s in i)if(delete i[s].t,i[s].its)for(let a in i[s].its)e.some(o=>o.eid===a)||(delete i[s].its[a],Object.keys(i[s].its).length||delete i[s]);else delete i[s];return i}setClipboardInfo(e,t,i){let s=e.filter(a=>t.some(o=>o.eid===a.eid));if(s.length){let a={items:s,lzn:this.getLznForItems(s,this.container.lzn),ct:this.container.ct,st:this.container.st,originId:i};this.clipboardService.setClipboard(a)}}clearSelection(){this.listItems.forEach(e=>e.setSelected(!1)),this.clearSelectionCount()}clearCut(){this.listItems.forEach(e=>e.setCut(!1))}getSelectedItems(){return this.listItems.filter(e=>e.isSelected)}},Us.ctorParameters=()=>[{type:A},{type:w},{type:F},{type:un},{type:b},{type:kn}],Us.propDecorators={listItems:[{type:wi,args:[Ns]}],area:[{type:h}],accessTitles:[{type:h}],accessErrors:[{type:h}],container:[{type:h}],query:[{type:h}],filter:[{type:h}],isEditable:[{type:h}],isHeader:[{type:h}],isContent:[{type:h}],itemContainerEmpty:[{type:h}],infoHeader:[{type:h}],isExperimental:[{type:h}],clearClipboard:[{type:rn,args:["window:keydown.escape"]}]},Us);Pe=d([Ue()],Pe);var Ao=class extends Pe{constructor(){super(...arguments),this.alignment=vt}ngOnInit(){let e="Add Image",t="This component is empty. Start adding content by clicking "+e+".";this.updateIsEmptyProperty(),this.initItems(e,t,"Image","Alignment"),this.infoHeader={text:"Only one image will be displayed.",title:"Images"}}addItem(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(hi,this.viewContainerRef).title("Add Image").id("lm-a-dp-image-add-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.updateIsEmptyProperty()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.isEdit=!1}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=x.toExpressions(t,this.accessTitles),s=this.dialogService.modal(hi,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Image`).id("lm-a-dp-image-edit-dialog").afterClose(a=>{this.isDialogOpen=!1,a&&this.updateIsEmptyProperty()});s.apply(a=>{a.modalDialog=s,a.container=this.container,a.oldImage=t,a.image=t,a.selectedExpressions=i,a.isEdit=!0,a.isPermissionTabOnInit=e,a.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.ims,"eid",s.eid);a>-1&&i.ims.splice(a,1)}this.pageService.updateContainer(i,null,e).pipe(G(()=>Y())).subscribe(()=>this.updateIsEmptyProperty())}onCopy(){this.copySelected(this.container.ims)}onCut(){this.cutSelected(this.container.ims)}onDeleteSelected(){this.deleteSelectedItems(this.container.ims)}getEntityCount(){return this.container.ims&&this.container.ims.length}updateIsEmptyProperty(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid),i=t.ims&&t.ims.length>0;this.isEmpty=!i,this.clearSelectionCount()}};Ao=d([p({selector:"lm-dynamic-image-list",template:Ge,styles:[ke]})],Ao);var Po,hi=(Po=class extends J{constructor(e){super("DynamicImageDialog"),this.dynamicPageService=e,this.alignment=vt,this.listLabel="Choose which set of users this image should be visible for.",this.urlMaxLength=I.dynPageUrlMaxLength,this.isSaveDisabled=!0,this.isEditable=!0}ngOnInit(){this.image=D({u:null,al:vt.Fill},this.image),this.initModalDialog(),this.setIsSaveDisabled()}getNewImageId(){return x.getNewEntityId(this.container)}setIsSaveDisabled(){this.isSaveDisabled=ue.isNullOrWhitespace(this.image.u)}save(){if(!this.isEditable)return;this.image.eid||(this.image.eid=this.getNewImageId());let e=v.copy(this.image);this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null),this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntity(this.container,e,this.oldImage),!1,!0).subscribe(()=>this.modalDialog.close(e)):this.submitSafe(this.dynamicPageService.addContainerEntity(this.container,e),!1,!0).subscribe(()=>this.modalDialog.close(e))}},Po.ctorParameters=()=>[{type:F}],Po);hi=d([p({template:md})],hi);var pd=`<div style="width: 550px; height: 535px" #dialogViewContRef>\r
	<div soho-tabs (beforeActivated)="updateOptionsItems()">\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aec-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aec-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aec-trantab" tabId="Translations"\r
						>Translations</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<ng-container *ngIf="item.it === contentTypes.Attribute">\r
				<div class="field">\r
					<label class="required">User property</label>\r
					<button\r
						soho-button="primary"\r
						id="lm-a-dp-aec-sup-btn"\r
						*ngIf="!item.t"\r
						(click)="openUserPropertyDialog()">\r
						Select user property\r
					</button>\r
					<div class="selected-container" *ngIf="item.t">\r
						<h2 id="lm-a-dp-aec-propttl">{{ item.t | lmTrimCurlyBraces }}</h2>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-dp-aec-edit-btn"\r
							icon="edit"\r
							(click)="openUserPropertyDialog()">\r
							Edit\r
						</button>\r
					</div>\r
				</div>\r
				<div class="field">\r
					<label soho-label>Label</label>\r
					<input\r
						soho-radiobutton\r
						name="user-property"\r
						[value]="false"\r
						[(ngModel)]="isCustomLabel"\r
						id="lm-a-dp-aec-prop-chk"\r
						type="radio" />\r
					<label soho-label for="lm-a-dp-aec-prop-chk" [forRadioButton]="true"\r
						>Use user property name</label\r
					>\r
					<br />\r
					<input\r
						soho-radiobutton\r
						name="user-property"\r
						[value]="true"\r
						[(ngModel)]="isCustomLabel"\r
						id="lm-a-dp-aec-cust-chk"\r
						type="radio" />\r
					<label soho-label for="lm-a-dp-aec-cust-chk" [forRadioButton]="true"\r
						>Custom text</label\r
					>\r
					<br />\r
					<input\r
						type="text"\r
						id="lm-a-dp-aec-attrlbl-inp"\r
						[maxlength]="defaultMaxLength"\r
						[disabled]="!isCustomLabel"\r
						[(ngModel)]="attributeLabel"\r
						(ngModelChange)="updateProperty($event, 'l', false)" />\r
				</div>\r
			</ng-container>\r
			<ng-container *ngIf="item.it === contentTypes.Link">\r
				<lm-add-link\r
					[isContentLink]="true"\r
					(titleChanged)="updateProperty($event, 't', true)"\r
					[(link)]="item"></lm-add-link>\r
			</ng-container>\r
			<ng-container *ngIf="item.it === contentTypes.Text">\r
				<div class="field">\r
					<label soho-label>Label</label>\r
					<input\r
						type="text"\r
						id="lm-a-dp-aec-lbl-inp"\r
						style="width: 100%"\r
						[ngModel]="item.l"\r
						(ngModelChange)="updateProperty($event, 'l', false)"\r
						[maxlength]="defaultMaxLength" />\r
				</div>\r
				<div class="field content-type-text">\r
					<label class="required">Text</label>\r
					<textarea\r
						class="soho-textarea resizable required"\r
						id="lm-a-dp-aec-text-ta"\r
						style="width: 100%"\r
						#textItemTextArea\r
						[maxlength]="textMaxLength"\r
						[ngModel]="item.t"\r
						(ngModelChange)="updateProperty($event, 't', true)"\r
						aria-required="true"\r
						data-validate="required"\r
						required></textarea>\r
					<button\r
						class="hyperlink"\r
						id="lm-a-dp-aec-iup-btn"\r
						(click)="openUserPropertyDialog()">\r
						Insert user property\r
					</button>\r
				</div>\r
			</ng-container>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="item.op"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
		<div soho-tab-panel tabId="Translations">\r
			<p *ngIf="!isTranslateable">There is nothing to translate.</p>\r
			<lm-dynamic-page-translations\r
				*ngIf="isTranslateable"\r
				[localizations]="itemLzn"\r
				[optionsItems]="optionsItems"\r
				(localizationChange)="onLocalizationChange($event)">\r
			</lm-dynamic-page-translations>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aec-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aec-save-btn"\r
			class="btn-modal-primary no-validation"\r
			[disabled]="isSaveDisabled"\r
			(click)="save()">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var hd=`.content-type-text{display:flex;flex-direction:column}.content-type-text .hyperlink{align-self:flex-end}.selected-container{display:flex;justify-content:space-between}.selected-container h2{font-weight:700;margin-top:5px;vertical-align:middle}
/*# sourceMappingURL=add-content-dialog.css.map */
`;var Do,Gt=(Do=class extends J{constructor(){super("UserPropertiesListDialog")}ngOninit(){this.initModalDialog()}onPropertySelect(e){this.selected=e}closeWithSelected(e){e&&e.name?this.modalDialog.close(e):this.logDebug("closeWithSelected: selected property or property name is undefined.")}},Do.ctorParameters=()=>[],Do);Gt=d([p({template:`
		<lm-user-properties
			(selectedProperty)="onPropertySelect($event)"></lm-user-properties>
		<div class="modal-buttonset">
			<button class="btn-modal" (click)="close()">Cancel</button>
			<button
				class="btn-modal-primary"
				[disabled]="!selected"
				(click)="closeWithSelected(selected)">
				OK
			</button>
		</div>
	`})],Gt);var zs,ui=(zs=class extends Ot{constructor(e,t,i,s){super("DynamicInformationContentDialog",s),this.dynamicPageService=e,this.sohoModalDialogService=t,this.trimCurlyBracesPipe=i,this.isCustomLabel=!0,this.isSaveDisabled=!0,this.listLabel="Choose which set of users this content should be visible for.",this.contentTypes=ge,this.textMaxLength=I.dynPageTextMaxLength,this.defaultMaxLength=I.dynPageDefaultMaxLength}ngOnInit(){this.initModalDialog(),this.setLabel(),this.updateProperty(this.item.t,"t",!0),this.initLocalizations()}updateProperty(e,t,i){this.item=te(D({},this.item),{[t]:e}),i&&(this.isSaveDisabled=ue.isNullOrWhitespace(e))}setLabel(){let e=this.item,t=e.t?this.trimCurlyBracesPipe.transform(e.t):"";this.isCustomLabel=t!==e.l,this.isCustomLabel&&(this.attributeLabel=e.l)}save(){if(!this.isEditable)return;let e=this.getItemData();this.item.eid||(this.item.eid=x.getNewEntityId(this.container),e.eid=this.item.eid),this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null);let t=v.copy(this.container),i=this.hasInvalidTranslations(t.lzn);if(this.itemLznEdited){let s=this.getContainerLocalizations(this.itemLznEdited,e.eid);if(i){let a=this.getInvalidTranslations(t.lzn);t.lzn=D(D({},a),s)}else t.lzn=s}else i?t.lzn=this.getInvalidTranslations(t.lzn):t.lzn=null;this.hasInvalidTranslations(t.lzn)?this.showConfirmDiscardTranslations().subscribe(()=>{this.deleteTranslations(t.lzn),this.performSave(t,e)},null,()=>this.setCanClose(!0)):this.performSave(t,e)}performSave(e,t){this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntityWithLocalization(e,t,this.oldContent,this.container),!1,!0).subscribe(()=>this.modalDialog.close(t)):this.submitSafe(this.dynamicPageService.addContainerEntity(e,t,!1,this.container),!1,!0).subscribe(()=>this.modalDialog.close(t))}hasInvalidTranslation(e){let t=this.item,i=this.item.l,s=i&&i.length&&i.length>0,o=e.its&&e.its[t.eid]&&e.its[t.eid].l,n=o&&o.length&&o.length>0;return!s&&n}getEmptyTranslateablePropertyNames(){return this.item.l&&this.item.l.length?[]:["l"]}openUserPropertyDialog(){let e=this.sohoModalDialogService.modal(Gt,this.dialogViewContRef).title("Select User Property").id("lm-a-dp-info-c-selectprop-dialog").afterClose(t=>{t&&(this.applyUserProperty(t),this.updateProperty(this.item.t,"t",!0),this.textValidationDirective&&setTimeout(()=>this.textValidationDirective.validate({})))});e.apply(t=>{t.modalDialog=e}).open()}updateOptionsItems(){switch(this.optionsItems||(this.optionsItems=[]),this.item.it){case ge.Link:this.updateLinkOptionsItem();break;case ge.Attribute:this.updateAttributeOptionsItem();break;case ge.Text:this.updateTextOptionsItem();break;default:this.logDebug("ngOnInit: Could not determine item type for content")}this.setIsTranslateable(),this.optionsItems=[...this.optionsItems]}setIsTranslateable(){let e=this.item,t=e.l,i=t&&t.length>0,s=e.it===ge.Attribute;this.isTranslateable=!(s&&this.isCustomLabel)||i}updateLinkOptionsItem(){let e=this.getTranslationItemIndex("t");e>-1?this.optionsItems[e].defaultValue=this.item.t:this.setLinkOptionsItem()}setLinkOptionsItem(){this.setOptionsItems([{name:"t",label:"Title",labelId:"lm-a-dp-aec-at-t-lbl",valueId:"lm-a-dp-aec-at-t-inp",maxLength:I.dynPageDefaultMaxLength,defaultValue:this.item.t}])}updateAttributeOptionsItem(){let e=this.getTranslationItemIndex("l"),t=e>-1;this.hasLabel()?t?this.optionsItems[e].defaultValue=this.item.l:this.setAttributeOptionsItem():this.removeTranslationItem("l")}setAttributeOptionsItem(){let e=this.item,t=e.l?e.l:e.t&&!this.isCustomLabel?this.trimCurlyBracesPipe.transform(e.t):"";this.setOptionsItems([{name:"l",label:"Label",labelId:"lm-a-dp-aec-at-l-lbl",valueId:"lm-a-dp-aec-at-t-inp",maxLength:I.dynPageDefaultMaxLength,defaultValue:t}])}updateTextOptionsItem(){let e=this.getTranslationItemIndex("l"),t=this.getTranslationItemIndex("t"),i=e>-1,s=t>-1,a=this.optionsItems,o=this.item;this.hasLabel()?i&&s?(a[t].defaultValue=o.t,a[e].defaultValue=o.l):s?(a[t].defaultValue=o.t,this.addLabelOptionsItem()):i?(a[e].defaultValue=o.l,this.addTextOptionsItem()):(this.addLabelOptionsItem(),this.addTextOptionsItem()):(s?a[t].defaultValue=o.t:this.addTextOptionsItem(),this.removeTranslationItem("l"))}addLabelOptionsItem(){this.optionsItems.unshift({name:"l",label:"Label",labelId:"lm-a-dp-aec-at-l-lbl",valueId:"lm-a-dp-aec-at-t-inp",maxLength:I.dynPageDefaultMaxLength,defaultValue:this.item.l,isRequired:!1})}addTextOptionsItem(){this.optionsItems.push({name:"t",label:"Text",labelId:"lm-a-dp-aec-at-t-lbl",valueId:"lm-a-dp-aec-at-t-inp",maxLength:I.dynPageTextMaxLength,defaultValue:this.item.t,isTextArea:!0,isRequired:!1})}applyUserProperty(e){let t=x.formatProperty(e);switch(this.item.it){case ge.Link:this.logDebug("applyUserProperty: Not yet implemented on links");break;case ge.Attribute:this.item.t=t;break;case ge.Text:this.item.t=this.item.t?this.applyUserPropertyAtCaret(this.item,t):t;break;default:this.logDebug("applyUserProperty: Could not determine item type for content")}}applyUserPropertyAtCaret(e,t){let i=this.textItemTextArea.nativeElement.selectionStart,s=this.textItemTextArea.nativeElement.selectionEnd;return i!==void 0&&s!==void 0?e.t.slice(0,i)+t+e.t.slice(s):e.t+t}getItemData(){switch(this.item.it){case ge.Link:return this.item;case ge.Attribute:return this.attributeLabel&&(this.item.l=this.attributeLabel.trim()),this.isCustomLabel||(this.item.l=this.trimCurlyBracesPipe.transform(this.item.t)),this.item;case ge.Text:let e=this.item;return e.t=e.t.trim(),e.l&&(e.l=e.l.trim()),e;default:this.logDebug("getItemData: Could not determine item type for content")}}setOptionsItems(e){this.optionsItems=e}hasLabel(){let e=this.item,t=e.l,i=t&&t.length>0;return e.it===ge.Attribute&&!this.isCustomLabel||i}},zs.ctorParameters=()=>[{type:F},{type:w},{type:Fs},{type:b}],zs.propDecorators={dialogViewContRef:[{type:f,args:["dialogViewContRef",{read:A,static:!1}]}],textItemTextArea:[{type:f,args:["textItemTextArea",{static:!1}]}],textValidationDirective:[{type:f,args:[Sr,{static:!1}]}]},zs);ui=d([p({template:pd,styles:[hd]})],ui);var Fs=class{transform(e){e=e.replace(/[{}]/g,"");let t=e.indexOf("|");return t>0&&(e=e.substring(0,t)),e}};Fs=d([Ve({name:"lmTrimCurlyBraces"})],Fs);var Eo,Ws=(Eo=class extends Pe{constructor(){super(...arguments),this.contentAdded=new V}ngOnInit(){this.updateEmptyProperty(),this.initItems("Add Content","","Content type","Content","Label")}addLineBreak(){if(!this.canAdd())return;let e={eid:x.getNewEntityId(this.container),it:ge.Linebreak};this.pageService.addContainerEntity(this.container,e).subscribe()}addContent(e){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let t=this.dialogService.modal(ui,this.viewContainerRef).title("Add Content").id("lm-a-dp-info-addcontent-dialog").afterClose(i=>{this.isDialogOpen=!1,i&&this.updateEmptyProperty()});t.apply(i=>{i.modalDialog=t,i.container=this.container,i.isEdit=!1,i.containerLznEdited=i.container.lzn,i.item={it:e}}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=x.toExpressions(t,this.accessTitles),s=this.dialogService.modal(ui,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Content`).id("lm-a-dp-info-editcontent-dialog").afterClose(a=>{this.isDialogOpen=!1,a&&this.updateEmptyProperty()});s.apply(a=>{a.modalDialog=s,a.container=this.container,a.oldContent=t,a.item=t,a.selectedExpressions=i,a.isEdit=!0,a.containerLznEdited=a.container.lzn,a.isPermissionTabOnInit=e,a.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.its,"eid",s.eid);a>-1&&i.its.splice(a,1)}this.pageService.updateContainer(i,null,e).pipe(G(()=>Y())).subscribe(()=>this.updateEmptyProperty())}getEntityCount(){return(this.container.its&&this.container.its.length)+(this.container.hds&&this.container.hds.length)}updateEmptyProperty(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid),i=t.its&&t.its.length>0;this.isEmpty===i&&this.contentAdded.emit(),this.isEmpty=!i}},Eo.propDecorators={contentAdded:[{type:U}]},Eo);Ws=d([p({selector:"lm-content-list-component",template:Ge,styles:[ke]})],Ws);var ud=`<div style="width: 550px" #dialogViewContRef>\r
	<div soho-tabs (beforeActivated)="onTabChange()">\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aeh-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aeh-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aeh-trantab" tabId="Translations"\r
						>Translations</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<div class="field lm-margin-zero-b" id="header-color-bar">\r
				<label soho-label>Header color bar</label>\r
				<input\r
					soho-radiobutton\r
					name="header-color-bar"\r
					id="lm-a-dp-aeh-none-chk"\r
					type="radio"\r
					[value]="colorTypes.None"\r
					[(ngModel)]="header.clt" />\r
				<label soho-label for="lm-a-dp-aeh-none-chk" [forRadioButton]="true"\r
					>None</label\r
				>\r
				<br />\r
				<input\r
					soho-radiobutton\r
					name="header-color-bar"\r
					id="lm-a-dp-aeh-inhprnt-chk"\r
					type="radio"\r
					[value]="colorTypes.InheritParent"\r
					[(ngModel)]="header.clt" />\r
				<label soho-label for="lm-a-dp-aeh-inhprnt-chk" [forRadioButton]="true"\r
					>Use component icon color</label\r
				>\r
				<br />\r
				<input\r
					soho-radiobutton\r
					name="header-color-bar"\r
					id="lm-a-dp-aeh-inhpage-chk"\r
					type="radio"\r
					[value]="colorTypes.InheritPage"\r
					[(ngModel)]="header.clt" />\r
				<label soho-label for="lm-a-dp-aeh-inhpage-chk" [forRadioButton]="true"\r
					>Use page color</label\r
				>\r
				<br />\r
				<input\r
					soho-radiobutton\r
					name="header-color-bar"\r
					id="lm-a-dp-aeh-cust-chk"\r
					type="radio"\r
					[value]="colorTypes.Custom"\r
					[(ngModel)]="header.clt" />\r
				<label soho-label for="lm-a-dp-aeh-cust-chk" [forRadioButton]="true"\r
					>Select custom color</label\r
				>\r
				<br />\r
			</div>\r
			<div class="field">\r
				<input\r
					[class.disabled-colorpicker]="disabledColorPicker()"\r
					id="lm-a-dp-aeh-color-inp"\r
					name="header-color-picker"\r
					soho-colorpicker\r
					[disabled]="disabledColorPicker()"\r
					[editable]="colorpickerOptions.editable"\r
					[showLabel]="colorpickerOptions.showLabel"\r
					[colors]="colorpickerOptions.colors"\r
					[clearable]="false"\r
					[attributes]="{\r
						name: 'id',\r
						value: 'lm-a-dp-information-header-color'\r
					}"\r
					[(ngModel)]="selectedColorHex" />\r
			</div>\r
			<div class="field">\r
				<label soho-label>Image URL</label>\r
				<div class="header-input-area">\r
					<input\r
						#imgTextArea\r
						id="lm-a-dp-aeh-img-inp"\r
						type="text"\r
						style="width: 100%"\r
						[maxlength]="imgMaxLength"\r
						[(ngModel)]="imgText" />\r
					<button\r
						class="user-property hyperlink"\r
						id="lm-a-dp-aeh-iup-btn"\r
						(click)="openUserPropertyDialog(propertyField.Image, imgTextArea)">\r
						Insert user property\r
					</button>\r
				</div>\r
			</div>\r
			<div class="field" id="heading">\r
				<label soho-label>Heading</label>\r
				<input\r
					soho-radiobutton\r
					name="heading"\r
					type="radio"\r
					id="lm-a-dp-aeh-hnone-chk"\r
					[value]="headingStrategies.None"\r
					[(ngModel)]="h1Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-hnone-chk"\r
					>None</label\r
				>\r
				<input\r
					soho-radiobutton\r
					name="heading"\r
					type="radio"\r
					id="lm-a-dp-aeh-htxt-chk"\r
					[value]="headingStrategies.Text"\r
					[(ngModel)]="h1Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-htxt-chk"\r
					>Text</label\r
				>\r
				<input\r
					soho-radiobutton\r
					name="heading"\r
					type="radio"\r
					id="lm-a-dp-aeh-hup-chk"\r
					[value]="headingStrategies.Property"\r
					[(ngModel)]="h1Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-hup-chk"\r
					>User property</label\r
				>\r
				<br />\r
				<ng-container *ngIf="h1Strategy === headingStrategies.Property">\r
					<button\r
						soho-button="primary"\r
						id="lm-a-dp-aeh-hsup-btn"\r
						*ngIf="!h1Property"\r
						(click)="openUserPropertyDialog(propertyField.h1)">\r
						Select user property\r
					</button>\r
					<div class="selected-container" *ngIf="h1Property">\r
						<h2 id="lm-a-dp-aeh-hup-h2">\r
							{{ h1Property | lmTrimCurlyBraces }}\r
						</h2>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-dp-aeh-edithup-btn"\r
							icon="edit"\r
							(click)="openUserPropertyDialog(propertyField.h1)">\r
							Edit\r
						</button>\r
					</div>\r
				</ng-container>\r
				<ng-container *ngIf="h1Strategy === headingStrategies.Text">\r
					<div class="header-input-area">\r
						<input\r
							#h1TextArea\r
							id="lm-a-dp-aeh-htext-inp"\r
							type="text"\r
							class="headers-input"\r
							[maxlength]="inputMaxLength"\r
							[(ngModel)]="h1Text" />\r
						<button\r
							class="user-property hyperlink"\r
							id="lm-a-dp-aeh-hiup-btn"\r
							(click)="openUserPropertyDialog(propertyField.h1, h1TextArea)">\r
							Insert user property\r
						</button>\r
					</div>\r
				</ng-container>\r
			</div>\r
			<div class="field" id="subheading">\r
				<label soho-label>Subheading</label>\r
				<input\r
					soho-radiobutton\r
					name="subheading"\r
					type="radio"\r
					id="lm-a-dp-aeh-shnone-chk"\r
					[value]="headingStrategies.None"\r
					[(ngModel)]="h2Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-shnone-chk"\r
					>None</label\r
				>\r
				<input\r
					soho-radiobutton\r
					name="subheading"\r
					type="radio"\r
					id="lm-a-dp-aeh-shtxt-chk"\r
					[value]="headingStrategies.Text"\r
					[(ngModel)]="h2Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-shtxt-chk"\r
					>Text</label\r
				>\r
				<input\r
					soho-radiobutton\r
					name="subheading"\r
					type="radio"\r
					id="lm-a-dp-aeh-shup-chk"\r
					[value]="headingStrategies.Property"\r
					[(ngModel)]="h2Strategy" />\r
				<label soho-label [forRadioButton]="true" for="lm-a-dp-aeh-shup-chk"\r
					>User property</label\r
				>\r
				<br />\r
				<ng-container *ngIf="h2Strategy === headingStrategies.Property">\r
					<button\r
						soho-button="primary"\r
						id="lm-a-dp-aeh-shsup-btn"\r
						*ngIf="!h2Property"\r
						(click)="openUserPropertyDialog(propertyField.h2)">\r
						Select user property\r
					</button>\r
					<div class="selected-container" *ngIf="h2Property">\r
						<h2 id="lm-a-dp-aeh-shup-h2">\r
							{{ h2Property | lmTrimCurlyBraces }}\r
						</h2>\r
						<button\r
							soho-button="tertiary"\r
							id="lm-a-dp-aeh-editshup-btn"\r
							icon="edit"\r
							(click)="openUserPropertyDialog(propertyField.h2)">\r
							Edit\r
						</button>\r
					</div>\r
				</ng-container>\r
				<ng-container *ngIf="h2Strategy === headingStrategies.Text">\r
					<div class="input-translation">\r
						<div class="header-input-area">\r
							<input\r
								#h2TextArea\r
								id="lm-a-dp-aeh-shtext-inp"\r
								type="text"\r
								class="headers-input"\r
								[maxlength]="inputMaxLength"\r
								[(ngModel)]="h2Text" />\r
							<button\r
								class="user-property hyperlink"\r
								id="lm-a-dp-aeh-shiup-btn"\r
								(click)="openUserPropertyDialog(propertyField.h2, h2TextArea)">\r
								Insert user property\r
							</button>\r
						</div>\r
					</div>\r
				</ng-container>\r
			</div>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="header.op"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
		<div soho-tab-panel tabId="Translations">\r
			<p *ngIf="!isTranslateable">There is nothing to translate.</p>\r
			<lm-dynamic-page-translations\r
				*ngIf="isTranslateable"\r
				[localizations]="itemLzn"\r
				[optionsItems]="optionsItems"\r
				(localizationChange)="onLocalizationChange($event)">\r
			</lm-dynamic-page-translations>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aeh-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aeh-save-btn"\r
			class="btn-modal-primary"\r
			(click)="save()">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var gd=`.header-input-area{display:flex;flex-direction:column;width:100%}.input-translation{display:flex;flex-direction:row}.user-property{align-self:flex-end}.headers-input{width:100%}.disabled-colorpicker{color:#999!important;border-color:#bdbdbd!important;-webkit-text-fill-color:#999999!important}.disabled-colorpicker ::ng-deep+.trigger{cursor:default!important}.disabled-colorpicker ::ng-deep+.trigger>svg{cursor:default!important}.selected-container{display:flex;justify-content:space-between}.selected-container h2{font-weight:700;margin-top:5px;vertical-align:middle}
/*# sourceMappingURL=add-header-dialog.css.map */
`;var Vs,gi=(Vs=class extends Ot{constructor(e,t,i){super("DynamicInformationHeaderDialog",i),this.dynamicPageService=e,this.sohoModalDialogService=t,this.listLabel="Choose which set of users this header should be visible for.",this.propertyRegex=/^{[^{}]*?}$/,this.colorTypes=ie,this.colorpickerOptions=le.getColorpickerOptionsExtended(),this.imgMaxLength=I.dynPageUrlMaxLength,this.headingStrategies=Ne,this.propertyField=Gs,this.inputMaxLength=I.dynPageDefaultMaxLength}ngOnInit(){this.initLocalizations(),this.isEdit?this.header=D({},this.header):this.header=D({clt:this.colorTypes.None,eid:x.getNewEntityId(this.container),im:{u:null}},this.header),this.item={eid:this.header.eid},this.setInitialValues(),this.selectedColorNr?this.setColorToHex(this.selectedColorNr):this.setColorToHex(0),this.initModalDialog()}ngAfterViewInit(){this.colorpicker&&setTimeout(()=>{this.colorpicker.disabled=this.disabledColorPicker()},100)}disabledColorPicker(){return this.header.clt!==this.colorTypes.Custom}save(){if(!this.isEditable)return;this.header.eid||(this.header.eid=x.getNewEntityId(this.container));let e=this.getHeaderForSave();this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null);let t=v.copy(this.container),i=this.hasInvalidTranslations(t.lzn);if(this.itemLznEdited){let s=this.getContainerLocalizations(this.itemLznEdited,e.eid);if(i){let a=this.getInvalidTranslations(t.lzn);t.lzn=D(D({},a),s)}else t.lzn=s}else i?t.lzn=this.getInvalidTranslations(t.lzn):t.lzn=null;this.hasInvalidTranslations(t.lzn)?this.showConfirmDiscardTranslations().subscribe(()=>{this.deleteTranslations(t.lzn),this.performSave(t,e)},null,()=>this.setCanClose(!0)):this.performSave(t,e)}performSave(e,t){this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntityWithLocalization(e,t,this.oldHeader,this.container,!0),!1,!0).subscribe(()=>this.modalDialog.close(t)):this.submitSafe(this.dynamicPageService.addContainerEntity(e,t,!0,this.container),!1,!0).subscribe(()=>this.modalDialog.close(t))}openUserPropertyDialog(e,t){let i=this.sohoModalDialogService.modal(Gt,this.dialogViewContRef).title("Select User Property").id("lm-a-dp-info-h-selectprop-dialog").afterClose(s=>{s&&this.applyUserProperty(s,e,t)});i.apply(s=>{s.modalDialog=i}).open()}onTabChange(){this.optionsItems||(this.optionsItems=[]),this.updateH1OptionsItem(),this.updateH2OptionsItem(),this.optionsItems=[...this.optionsItems],this.isTranslateable=this.hasH1()||this.hasH2()}updateH1OptionsItem(){let e=this.getTranslationItemIndex("h1"),t=e>-1;this.hasH1()?t?this.optionsItems[e].defaultValue=this.h1Text:this.optionsItems.unshift({name:"h1",label:"Heading",labelId:"lm-a-dp-aeh-at-h1-lbl",valueId:"lm-a-dp-aeh-at-h1-inp",maxLength:this.inputMaxLength,defaultValue:this.h1Text,isRequired:!1}):t&&this.removeTranslationItem("h1")}updateH2OptionsItem(){let e=this.getTranslationItemIndex("h2"),t=e>-1;this.hasH2()?t?this.optionsItems[e].defaultValue=this.h2Text:this.optionsItems.push({name:"h2",label:"Subheading",labelId:"lm-a-dp-aeh-at-h2-lbl",valueId:"lm-a-dp-aeh-at-h2-inp",maxLength:this.inputMaxLength,defaultValue:this.h2Text,isRequired:!1}):t&&this.removeTranslationItem("h2")}hasH1(){return!!this.h1Text&&this.h1Strategy===Ne.Text}hasH2(){return!!this.h2Text&&this.h2Strategy===Ne.Text}getEmptyTranslateablePropertyNames(){let e=[];return this.hasH1()||e.push("h1"),this.hasH2()||e.push("h2"),e}hasInvalidTranslation(e){if(e.its&&e.its[this.item.eid]){let i=e.its[this.item.eid].h1&&e.its[this.item.eid].h1.length;if(!this.hasH1()&&i)return!0;let s=e.its[this.item.eid].h2&&e.its[this.item.eid].h2.length;if(!this.hasH2()&&s)return!0}return!1}setColorToHex(e){this.selectedColorHex=le.numberToHexCodeExtended(e)}setColorToNumber(){this.selectedColorHex=this.colorpicker.getHexValue(),this.selectedColorNr=le.hexCodeToNumberExtended(this.selectedColorHex)}applyUserProperty(e,t,i){let s=x.formatProperty(e);switch(t){case Gs.Image:i?this.imgText=this.applyUserPropertyAtCaret(s,this.imgText,i):this.logDebug("applyUserProperty: Input component for html field is undefined.");break;case Gs.h1:i?this.h1Text=this.applyUserPropertyAtCaret(s,this.h1Text,i):this.h1Property=s;break;case Gs.h2:i?this.h2Text=this.applyUserPropertyAtCaret(s,this.h2Text,i):this.h2Property=s;break;default:this.logDebug("applyUserProperty: Could not determine which field to update.")}}applyUserPropertyAtCaret(e,t,i){if(!t)return e;let s=i.selectionStart,a=i.selectionEnd;return W.isUndefined(s)&&W.isUndefined(a)?t.slice(0,s)+e+t.slice(a):t+e}getHeaderForSave(){let e=v.copy(this.header);return this.imgText?e.im={u:this.imgText}:e.im=null,e.h1=this.h1Strategy===Ne.Text?this.h1Text:this.h1Strategy===Ne.Property?this.h1Property:void 0,e.h2=this.h2Strategy===Ne.Text?this.h2Text:this.h2Strategy===Ne.Property?this.h2Property:void 0,e.clt===this.colorTypes.Custom&&(this.setColorToNumber(),e.cl=this.selectedColorNr),e}setInitialValues(){this.header.im&&(this.imgText=this.header.im.u);let e=this.header.h1;ue.isNullOrWhitespace(e)?this.h1Strategy=Ne.None:e.match(this.propertyRegex)?(this.h1Property=e,this.h1Strategy=Ne.Property):(this.h1Text=e,this.h1Strategy=Ne.Text);let t=this.header.h2;ue.isNullOrWhitespace(t)?this.h2Strategy=Ne.None:t.match(this.propertyRegex)?(this.h2Property=t,this.h2Strategy=Ne.Property):(this.h2Text=t,this.h2Strategy=Ne.Text)}formatProperty(e){return`{${e}}`}},Vs.ctorParameters=()=>[{type:F},{type:w},{type:b}],Vs.propDecorators={dialogViewContRef:[{type:f,args:["dialogViewContRef",{read:A,static:!1}]}],colorpicker:[{type:f,args:[Et,{static:!1}]}]},Vs);gi=d([p({template:ud,styles:[gd]})],gi);var Ne;(function(m){m[m.None=1]="None",m[m.Text=2]="Text",m[m.Property=3]="Property"})(Ne||(Ne={}));var Gs;(function(m){m[m.Image=1]="Image",m[m.h1=2]="h1",m[m.h2=3]="h2"})(Gs||(Gs={}));var To,_s=(To=class extends Pe{constructor(){super(...arguments),this.headerAdded=new V,this.colorTypes=ie}ngOnInit(){this.updateEmptyProperty(),this.initItems("Add Header","","Header color bar","Image","Heading","Subheading"),this.automationIdentifier=this.automationIdentifier+"-h"}addHeader(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(gi,this.viewContainerRef).title("Add Header").id("lm-a-dp-info-addheader-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.updateEmptyProperty()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.containerLznEdited=this.container.lzn,t.isEdit=!1}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=x.toExpressions(t,this.accessTitles),s=this.dialogService.modal(gi,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Header`).id("lm-a-dp-info-editheader-dialog").afterClose(a=>{this.isDialogOpen=!1,a&&this.updateEmptyProperty()});s.apply(a=>{a.modalDialog=s,a.selectedColorNr=t.cl,a.isEdit=!0,a.container=this.container,a.containerLznEdited=this.container.lzn,a.oldHeader=t,a.header=t,a.item={eid:t.eid},a.selectedExpressions=i,a.isPermissionTabOnInit=e,a.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.hds,"eid",s.eid);a>-1&&i.hds.splice(a,1)}this.pageService.updateContainer(i,i,e).pipe(G(()=>Y())).subscribe(()=>this.updateEmptyProperty())}getEntityCount(){return(this.container.its&&this.container.its.length)+(this.container.hds&&this.container.hds.length)}updateEmptyProperty(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid),i=t.hds&&t.hds.length>0;this.isEmpty===i&&this.headerAdded.emit(),this.isEmpty=!i}},To.propDecorators={headerAdded:[{type:U}]},To);_s=d([p({selector:"lm-header-list-component",template:Ge,styles:[ke]})],_s);var bd=`.header-container{padding:10px 0}.content-container{padding:25px 0 10px}h2{padding:5px 0}.add-button-container.empty{height:100px}.dyn-experimental{height:14px}
/*# sourceMappingURL=information.css.map */
`;var ko,On=(ko=class extends Pe{constructor(){super(...arguments),this.experimentalTooltip=I.dynPageExperimentalFeatureMsg}ngOnInit(){this.menuId="lm-a-d-in-emp"+this.container.eid,this.updateEmptyProperty()}updateEmptyProperty(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid);this.hasHeader=t.hds&&t.hds.length>0,this.hasContent=t.its&&t.its.length>0,this.isEmpty=!this.hasHeader&&!this.hasContent}addLineBreak(){this.contentList.addLineBreak()}addHeader(){this.headerList.addHeader(),this.hasHeader=!this.headerList.isEmpty}addContent(e){this.contentList.addContent(e),this.hasContent=!this.contentList.isEmpty}getEntityCount(){return(this.container.its&&this.container.its.length)+(this.container.hds&&this.container.hds.length)}},ko.propDecorators={headerList:[{type:f,args:[_s,{static:!1}]}],contentList:[{type:f,args:[Ws,{static:!1}]}]},ko);On=d([p({selector:"lm-dynamic-information-list",template:`
		<p>
			<svg soho-icon class="dyn-experimental" icon="formula-constituents"></svg>
			<small class="text-descriptive">{{ experimentalTooltip }}</small>
		</p>

		<div class="header-container" *ngIf="!isEmpty">
			<h2>Header</h2>
			<label *ngIf="!hasHeader && hasContent" soho-label
				>No header has been configured.</label
			>
			<label *ngIf="hasHeader" soho-label
				>Only one header will be displayed.</label
			>
		</div>
		<lm-header-list-component
			(headerAdded)="updateEmptyProperty()"
			[area]="area"
			[itemContainerEmpty]="isEmpty"
			[container]="container"
			[isHeader]="true"
			[accessTitles]="accessTitles"
			[accessErrors]="accessErrors"
			[query]="query"
			[filter]="filter"
			[isEditable]="isEditable">
		</lm-header-list-component>

		<div class="content-container" *ngIf="!isEmpty">
			<h2>Content</h2>
			<label *ngIf="!hasContent" soho-label>No content has been added.</label>
		</div>

		<lm-content-list-component
			(contentAdded)="updateEmptyProperty()"
			[area]="area"
			[itemContainerEmpty]="isEmpty"
			[container]="container"
			[isContent]="true"
			[accessTitles]="accessTitles"
			[accessErrors]="accessErrors"
			[query]="query"
			[filter]="filter"
			[isEditable]="isEditable">
		</lm-content-list-component>

		<div class="add-button-container empty" *ngIf="isEmpty">
			<p>
				This component is empty. Start configuring by clicking Add Header or Add
				Content.
			</p>
			<div class="add-buttons">
				<button
					soho-button="primary"
					[name]="automationIdentifier + '-addempty-btn'"
					[attr.data-lm-a-dp-addempty-btn]="container.eid"
					icon="add"
					(click)="addHeader()"
					[disabled]="!isEditable">
					Add Header
				</button>
				<lm-dyn-info-menu-btn
					[menuId]="menuId"
					[entity]="container.eid"
					[isPrimary]="true"
					[isEditable]="isEditable"
					(selected)="addContent($event)"></lm-dyn-info-menu-btn>
			</div>
		</div>
	`,styles:[bd]})],On);var Zs,Rn=(Zs=class{constructor(e){this.zone=e,this.isEditable=!0,this.selected=new V,this.dynamicItemType=ge}onSelected(e){this.selected.emit(parseInt(e))}},Zs.ctorParameters=()=>[{type:B}],Zs.propDecorators={menuId:[{type:h}],isPrimary:[{type:h}],entity:[{type:h}],isEditable:[{type:h}],selected:[{type:U}]},Zs);Rn=d([p({selector:"lm-dyn-info-menu-btn",template:`
		<button
			soho-menu-button
			name="lm-a-dp-info-addcontent-button"
			[attr.data-lm-a-dp-icm-btn]="entity"
			[class.btn-primary]="isPrimary"
			icon="add"
			[menu]="menuId"
			[disabled]="!isEditable"
			(selected)="onSelected($event.args[0].id)">
			<span> Add Content </span>
		</button>
		<ul soho-popupmenu [id]="menuId" name="lm-a-dp-info-addcontent-menu">
			<li soho-popupmenu-item>
				<a
					soho-popupmenu-label
					name="lm-a-dp-info-addlink"
					id="{{ dynamicItemType.Link }}"
					>Link</a
				>
			</li>
			<li soho-popupmenu-item>
				<a
					soho-popupmenu-label
					name="lm-a-dp-info-addtext"
					id="{{ dynamicItemType.Text }}"
					>Text</a
				>
			</li>
			<li soho-popupmenu-item>
				<a
					soho-popupmenu-label
					name="lm-a-dp-info-addpropery"
					id="{{ dynamicItemType.Attribute }}"
					>User Property</a
				>
			</li>
		</ul>
	`})],Rn);var fd=`<div class="field">\r
	<label class="required">Title</label>\r
	<input\r
		soho-input\r
		id="lm-a-dp-ael-ttl-inp"\r
		[maxlength]="titleMaxLength"\r
		[(ngModel)]="link.t"\r
		(ngModelChange)="onTitleChanged($event)"\r
		data-validate="required" />\r
</div>\r
<div class="field" *ngIf="isShortcut">\r
	<label class="required">Shortcut URL</label>\r
	<input\r
		soho-input\r
		id="lm-a-dp-ael-surl-inp"\r
		[maxlength]="urlMaxLength"\r
		[(ngModel)]="link.u"\r
		(ngModelChange)="onTitleChanged($event)"\r
		data-validate="required" />\r
</div>\r
<div class="field" *ngIf="!isShortcut || isContentLink">\r
	<label>Link URL</label>\r
	<input\r
		soho-input\r
		id="lm-a-dp-ael-lurl-inp"\r
		[maxlength]="urlMaxLength"\r
		[(ngModel)]="link.u" />\r
</div>\r
<div class="field" *ngIf="!isShortcut && !isContentLink">\r
	<label soho-label>Type</label>\r
	<input\r
		soho-radiobutton\r
		id="lm-a-dp-ael-typelink-chk"\r
		type="radio"\r
		name="link-type"\r
		[value]="linkSizes.Heading"\r
		[(ngModel)]="link.sz"\r
		checked />\r
	<label soho-label for="lm-a-dp-ael-typelink-chk" [forRadioButton]="true"\r
		>Link</label\r
	>\r
	<br />\r
	<input\r
		soho-radiobutton\r
		id="lm-a-dp-ael-typesublink-chk"\r
		type="radio"\r
		name="link-type"\r
		[value]="linkSizes.Normal"\r
		[(ngModel)]="link.sz" />\r
	<label soho-label for="lm-a-dp-ael-typesublink-chk" [forRadioButton]="true"\r
		>Sublink</label\r
	>\r
</div>\r
<lm-icon-selector\r
	[icon]="link.i"\r
	[color]="link.cl"\r
	[colorType]="link.clt"\r
	[isDisabled]="!isLinkHeading() && !isShortcut && !isContentLink"\r
	[isIconMandatory]="isShortcut"\r
	(iconChanged)="onIconChanged($event)"\r
	(colorChanged)="onColorChanged($event)"\r
	(colorTypeChanged)="onColorTypeChanged($event)">\r
</lm-icon-selector>\r
`;var yd=`<div style="width: 550px">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-ael-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-ael-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-ael-trantab" tabId="Translations"\r
						>Translations</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<lm-add-link\r
				[isShortcut]="isShortcut"\r
				[(link)]="item"\r
				(titleChanged)="onInputChanged()"></lm-add-link>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="item.op"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
		<div soho-tab-panel tabId="Translations">\r
			<lm-dynamic-page-translations\r
				[localizations]="itemLzn"\r
				[optionsItems]="optionsItems"\r
				(localizationChange)="onLocalizationChange($event)">\r
			</lm-dynamic-page-translations>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-ael-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-ael-savebtn"\r
			class="btn-modal-primary no-validation"\r
			(click)="save()"\r
			[disabled]="isSaveDisabled">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var Ro,Mn=(Ro=class{constructor(){this.isShortcut=!1,this.isContentLink=!1,this.titleChanged=new V,this.linkSizes=mn,this.colorTypes=ie,this.urlMaxLength=I.dynPageUrlMaxLength,this.titleMaxLength=I.dynPageDefaultMaxLength}isLinkHeading(){return this.link.sz===this.linkSizes.Heading}onIconChanged(e){this.link.i=e}onColorChanged(e){this.link.cl=e}onColorTypeChanged(e){this.link.clt=e}onTitleChanged(e){this.titleChanged.emit(e)}},Ro.propDecorators={isShortcut:[{type:h}],isContentLink:[{type:h}],link:[{type:h}],titleChanged:[{type:U}]},Ro);Mn=d([p({selector:"lm-add-link",template:fd})],Mn);var Mo,bi=(Mo=class extends Ot{constructor(e,t){super("DynamicLinkListDialog",t),this.dynamicPageService=e,this.linkSizes=mn,this.listLabel="Choose which set of users this link should be visible for."}ngOnInit(){this.initLocalizations(),this.item=D({sz:this.linkSizes.Heading,cl:0},this.item),this.optionsItems=[{name:"t",label:"Title",labelId:"lm-a-dp-ael-at-t-lbl",valueId:"lm-a-dp-ael-at-t-inp",maxLength:I.dynPageDefaultMaxLength,defaultValue:this.item.t}],this.initModalDialog(),this.onInputChanged()}onInputChanged(){this.isSaveDisabled=ue.isNullOrWhitespace(this.item.t)||this.isShortcut&&ue.isNullOrWhitespace(this.item.u);let e=this.getTranslationItemIndex("t");e>-1&&(this.optionsItems[e].defaultValue=this.item.t)}cancel(){this.modalDialog.close()}save(){if(!this.isEditable)return;this.item.eid||(this.item.eid=this.getNewLinkId());let e=v.copy(this.item);e.sz!==this.linkSizes.Heading&&!this.isShortcut&&(e.cl=null,e.i=null),this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null);let t=v.copy(this.container);t.lzn=null,this.itemLznEdited&&(t.lzn=this.getContainerLocalizations(this.itemLznEdited,e.eid)),this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntityWithLocalization(t,e,this.oldLink,this.container),!1,!0).subscribe(()=>this.modalDialog.close(e)):this.submitSafe(this.dynamicPageService.addContainerEntity(t,e,!1,this.container),!1,!0).subscribe(()=>this.modalDialog.close(e))}getNewLinkId(){return x.getNewEntityId(this.container)}hasInvalidTranslation(e){return!1}getEmptyTranslateablePropertyNames(){return[]}},Mo.ctorParameters=()=>[{type:F},{type:b}],Mo);bi=d([p({selector:"lm-add-link-dialog",template:yd})],bi);var Lo,Oo=(Lo=class extends Pe{constructor(){super(...arguments),this.linkSizes=mn}ngOnInit(){let e=this.isShortcut?"Add Shortcut":"Add Link",t="This component is empty. Start adding content by clicking "+e+".";this.updateEmptyProperty();let i=this.isShortcut?"Shortcut URL":"Link URL";this.initItems(e,t,"Title",i,"Icon background color")}addItem(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(bi,this.viewContainerRef).title(this.addItemText).id("lm-a-dp-linklist-add-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.updateEmptyProperty()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.containerLznEdited=t.container.lzn,t.isShortcut=this.isShortcut,t.isEdit=!1}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=x.toExpressions(t,this.accessTitles),s=this.isEditable?"Edit":"View",a=this.dialogService.modal(bi,this.viewContainerRef).title(this.isShortcut?`${s} Shortcut`:`${s} Link`).id("lm-a-dp-linklist-edit-dialog").afterClose(o=>{this.isDialogOpen=!1,o&&this.updateEmptyProperty()});a.apply(o=>{o.modalDialog=a,o.container=this.container,o.oldLink=t,o.item=t,o.isShortcut=this.isShortcut,o.selectedExpressions=i,o.isEdit=!0,o.containerLznEdited=o.container.lzn,o.isPermissionTabOnInit=e,o.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.its,"eid",s.eid);a>-1&&i.its.splice(a,1)}this.pageService.updateContainer(i,i,e).pipe(G(()=>Y())).subscribe(()=>this.updateEmptyProperty())}getEntityCount(){return this.container.its&&this.container.its.length}onCopy(){this.copySelected(this.container.its)}onCut(){this.cutSelected(this.container.its)}onDeleteSelected(){this.deleteSelectedItems(this.container.its)}updateEmptyProperty(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid),i=t.its&&t.its.length>0;this.isEmpty=!i,this.clearSelectionCount()}},Lo.propDecorators={isShortcut:[{type:h}]},Lo);Oo=d([p({selector:"lm-dynamic-link-list",template:Ge,styles:[ke]})],Oo);var vd=`<div style="width: 550px">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aetx-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aetx-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aetx-trantab" tabId="Translations"\r
						>Translations</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<label class="required">Text</label>\r
			<lm-markdown-editor\r
				[help]="true"\r
				[(model)]="text.tx"\r
				[maxLength]="textMaxLength"\r
				style="min-height: 50vh">\r
			</lm-markdown-editor>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="text.op"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
		<div soho-tab-panel tabId="Translations">\r
			<lm-dynamic-page-translations\r
				[localizations]="itemLzn"\r
				[optionsItems]="optionsItems"\r
				(localizationChange)="onLocalizationChange($event)">\r
			</lm-dynamic-page-translations>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aetx-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aetx-save-btn"\r
			class="btn-modal-primary"\r
			[disabled]="!canSave()"\r
			(click)="save()">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var No=class extends Pe{ngOnInit(){let e="Add Text",t="This component is empty. Start adding content by clicking "+e+".";this.initItems(e,t,"Text",""),this.infoHeader={text:"Only one text will be displayed.",title:"Texts"},this.isExperimental=!0,this.update()}addItem(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(fi,this.viewContainerRef).title("Add Text").id("lm-a-dp-text-add-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.update()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.containerLznEdited=t.container.lzn,t.isEdit=!1}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=this.dialogService.modal(fi,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Text`).id("lm-a-dp-text-edit-dialog").afterClose(s=>{this.isDialogOpen=!1,s&&this.update()});i.apply(s=>{s.modalDialog=i,s.container=this.container,s.oldText=t,s.text=t,s.selectedExpressions=x.toExpressions(t,this.accessTitles),s.containerLznEdited=s.container.lzn,s.isEdit=!0,s.isPermissionTabOnInit=e,s.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.txts,"eid",s.eid);a>-1&&i.txts.splice(a,1)}this.pageService.updateContainer(i,null,e).pipe(G(()=>Y())).subscribe(()=>this.update())}getEntityCount(){return this.container.txts&&this.container.txts.length}onCopy(){this.copySelected(this.container.txts)}onCut(){this.cutSelected(this.container.txts)}onDeleteSelected(){this.deleteSelectedItems(this.container.txts)}update(){let e=this.pageService.getPage().cts,t=u.itemByProperty(e,"eid",this.container.eid);this.isEmpty=!(t.txts&&t.txts.length>0),this.clearSelectionCount()}};No=d([p({selector:"lm-dynamic-text-list",template:Ge,styles:[ke]})],No);var Bo,fi=(Bo=class extends Ot{constructor(e,t){super("DynamicTextDialog",t),this.dynamicPageService=e,this.textMaxLength=I.dynTextMaxLength,this.listLabel="Choose which set of users this text should be visible for."}ngOnInit(){this.text=D({},this.text),this.item=this.text,this.initLocalizations(),this.optionsItems=[{name:"tx",label:"Text",labelId:"lm-a-dp-aetx-at-tx-lbl",valueId:"lm-a-dp-aetx-at-tx-inp",maxLength:this.textMaxLength,isMarkdown:!0,defaultValue:this.text.tx}],this.initModalDialog()}hasInvalidTranslation(e){return!1}getEmptyTranslateablePropertyNames(){return[]}save(){if(!this.isEditable)return;let e=this.toText(),t=this.toContainer(e),i=this.toObservable(t,e);this.submitSafe(i,!1,!0).subscribe(()=>this.modalDialog.close(e))}canSave(){return!this.isBusy&&this.hasText()}hasText(){let e=this.text.tx;return!!(e&&e.trim())}toText(){let e=v.copy(this.text);return e.eid||(e.eid=x.getNewEntityId(this.container)),this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null),e}toContainer(e){let t=v.copy(this.container);return t.lzn=null,this.itemLznEdited&&(t.lzn=this.getContainerLocalizations(this.itemLznEdited,e.eid)),t}toObservable(e,t){return this.isEdit?this.dynamicPageService.editContainerEntityWithLocalization(e,t,this.oldText,this.container):this.dynamicPageService.addContainerEntity(e,t)}},Bo.ctorParameters=()=>[{type:F},{type:b}],Bo);fi=d([p({template:vd})],fi);var xd=`<div style="width: 550px">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aeweb-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aeweb-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<form [formGroup]="form">\r
				<div class="field">\r
					<label class="required">URL</label>\r
					<input\r
						formControlName="url"\r
						id="lm-a-dp-aeweb-url-inp"\r
						[maxlength]="urlMaxLength"\r
						data-validate="required" />\r
				</div>\r
				<div class="field">\r
					<label soho-label>Action</label>\r
\r
					<input\r
						soho-radiobutton\r
						type="radio"\r
						id="lm-a-dp-aeweb-actionnone-chk"\r
						value="none"\r
						formControlName="action" />\r
					<label\r
						soho-label\r
						[forRadioButton]="true"\r
						for="lm-a-dp-aeweb-actionnone-chk"\r
						>None</label\r
					>\r
					<br />\r
					<input\r
						soho-radiobutton\r
						type="radio"\r
						id="lm-a-dp-aeweb-actionrefresh-chk"\r
						value="refresh"\r
						formControlName="action" />\r
					<label\r
						soho-label\r
						[forRadioButton]="true"\r
						for="lm-a-dp-aeweb-actionrefresh-chk"\r
						>Refresh</label\r
					>\r
					<br />\r
					<input\r
						soho-radiobutton\r
						type="radio"\r
						id="lm-a-dp-aeweb-actionlaunch-chk"\r
						value="launch"\r
						formControlName="action" />\r
					<label\r
						soho-label\r
						[forRadioButton]="true"\r
						for="lm-a-dp-aeweb-actionlaunch-chk"\r
						>Launch</label\r
					>\r
				</div>\r
				<div class="field" *ngIf="showLaunchUrl">\r
					<label class="required">Launch URL</label>\r
					<input\r
						formControlName="launchUrl"\r
						id="lm-a-dp-aeweb-launchurl-inp"\r
						[maxlength]="urlMaxLength"\r
						data-validate="required" />\r
				</div>\r
			</form>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="web.op"\r
				[showOperator]="true"></lm-dynamic-permissions>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aeweb-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aeweb-save-btn"\r
			class="btn-modal-primary"\r
			(click)="save()"\r
			[disabled]="!form.valid">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var Uo=class extends Pe{ngOnInit(){let e="Add Web Page",t="This component is empty. Start adding content by clicking "+e+".";this.initItems(e,t,"URL","Action"),this.infoHeader={text:"Only one web page will be displayed.",title:"Web pages"},this.update()}addItem(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(yi,this.viewContainerRef).title("Add Web Page").id("lm-a-dp-web-add-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.update()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.isEdit=!1}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=this.dialogService.modal(yi,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Web Page`).id("lm-a-dp-web-edit-dialog").afterClose(s=>{this.isDialogOpen=!1,s&&this.update()});i.apply(s=>{s.modalDialog=i,s.container=this.container,s.oldWeb=t,s.web=t,s.selectedExpressions=x.toExpressions(t,this.accessTitles),s.isEdit=!0,s.isPermissionTabOnInit=e,s.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.wbs,"eid",s.eid);a>-1&&i.wbs.splice(a,1)}this.pageService.updateContainer(i,null,e).pipe(G(()=>Y())).subscribe(()=>this.update())}getEntityCount(){return this.container.wbs&&this.container.wbs.length}onCopy(){this.copySelected(this.container.wbs)}onCut(){this.cutSelected(this.container.wbs)}onDeleteSelected(){this.deleteSelectedItems(this.container.wbs)}update(){let e=this.container;this.isEmpty=!(e.wbs&&e.wbs.length>0),this.clearSelectionCount()}};Uo=d([p({selector:"lm-dynamic-web-list",template:Ge,styles:[ke]})],Uo);var Fo,yi=(Fo=class extends J{constructor(e){super("DynamicWebDialog"),this.dynamicPageService=e,this.urlMaxLength=I.dynPageUrlMaxLength,this.listLabel="Choose which set of users this web page should be visible for.",this.isEditable=!0,this.form=new ln({action:new Ye("none",[yt.required,yt.maxLength(I.dynPageUrlMaxLength)]),launchUrl:new Ye,url:new Ye(null,yt.required)}),this.form.controls.action.valueChanges.subscribe(t=>this.actionValueChanged(t))}ngOnInit(){this.web=D({},this.web),this.initFormValues(),this.initModalDialog()}save(){if(!this.isEditable)return;this.web.eid||(this.web.eid=x.getNewEntityId(this.container)),this.readFormValues();let e=v.copy(this.web);this.expressions?(e.as=1,e.ais=x.toIds(this.expressions),e.op=x.getOperator(this.expressions)):this.selectedExpressions&&(e.as=null,e.ais=null),this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntity(this.container,e,this.oldWeb),!1,!0).subscribe(()=>this.modalDialog.close(e)):this.submitSafe(this.dynamicPageService.addContainerEntity(this.container,e),!1,!0).subscribe(()=>this.modalDialog.close(e))}actionValueChanged(e){let t=this.form.controls.launchUrl;e==="launch"?(t.setValidators(yt.required),this.showLaunchUrl=!0):(t.clearValidators(),this.showLaunchUrl=!1),t.updateValueAndValidity({onlySelf:!0})}initFormValues(){let e=this.form.controls;e.url.setValue(this.web.u),e.launchUrl.setValue(this.web.lu);let t=e.action;t.setValue("none"),this.web.er?t.setValue("refresh"):this.web.lu?t.setValue("launch"):t.setValue("none"),this.actionValueChanged(t.value)}readFormValues(){let e=this.form.controls;this.web.u=e.url.value;let t=e.action.value,i=e.launchUrl.value;this.web.lu=t==="launch"?i:null,this.web.er=t==="refresh"}},Fo.ctorParameters=()=>[{type:F}],Fo);yi=d([p({template:xd})],yi);var Sd=`<div style="min-width: 550px">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title id="lm-a-dp-aewid-basictab" tabId="Basic">Basic</a>\r
				</li>\r
				<li soho-tab [selected]="isPermissionTabOnInit">\r
					<a soho-tab-title id="lm-a-dp-aewid-pmtab" tabId="Permissions"\r
						>Permissions</a\r
					>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="Basic">\r
			<div style="display: flex; flex-direction: column">\r
				<button\r
					*ngIf="!widget"\r
					id="lm-a-dp-aewid-select-btn"\r
					soho-button="primary"\r
					icon="search-list"\r
					(click)="selectWidget()">\r
					Select widget\r
				</button>\r
				<p *ngIf="widget">Selected widget:</p>\r
				<div\r
					*ngIf="widget"\r
					style="display: flex; flex-direction: row; margin-top: 5px">\r
					<h2\r
						id="lm-a-dp-aewid-swidget-h2"\r
						style="\r
							flex: 1 1 auto;\r
							font-weight: bold;\r
							margin-top: 5px;\r
							vertical-align: middle;\r
						">\r
						{{ widget.t }}\r
					</h2>\r
					<button\r
						soho-button="tertiary"\r
						id="lm-a-dp-aewid-eswidget-btn"\r
						icon="edit"\r
						(click)="selectWidget()">\r
						Edit\r
					</button>\r
				</div>\r
			</div>\r
		</div>\r
		<div soho-tab-panel tabId="Permissions">\r
			<lm-dynamic-permissions\r
				[listLabel]="listLabel"\r
				[selectedExpressions]="selectedExpressions"\r
				[(selected)]="expressions"\r
				[operator]="widget?.op || '||'"\r
				showOperator="true"></lm-dynamic-permissions>\r
		</div>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			id="lm-a-dp-aewid-cncl-btn"\r
			class="btn-modal"\r
			(click)="close()">\r
			Cancel\r
		</button>\r
		<button\r
			type="button"\r
			id="lm-a-dp-aewid-save-btn"\r
			class="btn-modal-primary"\r
			[disabled]="!canSave"\r
			(click)="save()">\r
			{{ isEditable ? "Save" : "OK" }}\r
		</button>\r
	</div>\r
</div>\r
`;var zo=class extends Pe{ngOnInit(){let e="Add Widget",t="This component is empty. Start adding content by clicking "+e+".";this.initItems(e,t,"Widget",""),this.update()}addItem(){if(!this.canAdd()||this.isDialogOpen)return;this.isDialogOpen=!0;let e=this.dialogService.modal(vi,this.viewContainerRef).title("Add Widget").id("lm-a-dp-widget-add-dialog").afterClose(t=>{this.isDialogOpen=!1,t&&this.update()});e.apply(t=>{t.modalDialog=e,t.container=this.container,t.isEdit=!1,t.isBanner=this.area=="banner"}).open()}editItem(e,t){if(this.isDialogOpen)return;this.isDialogOpen=!0;let i=x.toExpressions(t,this.accessTitles),s=this.dialogService.modal(vi,this.viewContainerRef).title(`${this.isEditable?"Edit":"View"} Widget`).id("lm-a-dp-widget-edit-dialog").afterClose(a=>{this.isDialogOpen=!1,a&&this.update()});s.apply(a=>{a.modalDialog=s,a.container=this.container,a.oldWidget=t,a.widget=t,a.selectedExpressions=i,a.isEdit=!0,a.isBanner=this.area==="banner",a.isPermissionTabOnInit=e,a.isEditable=this.isEditable}).open()}deleteItems(e,t){let i=v.copy(t||this.container);for(let s of e){let a=u.indexByProperty(i.ws,"eid",s.eid);a>-1&&i.ws.splice(a,1)}this.pageService.updateContainer(i,null,e).pipe(G(()=>Y())).subscribe(()=>this.update())}getEntityCount(){return this.container.ws&&this.container.ws.length}onCopy(){this.copySelected(this.container.ws)}onCut(){this.cutSelected(this.container.ws)}onDeleteSelected(){this.deleteSelectedItems(this.container.ws)}update(){let e=this.container;this.isEmpty=!(e.ws&&e.ws.length>0),this.clearSelectionCount()}};zo=d([p({selector:"lm-dynamic-widget-list",template:Ge,styles:[ke]})],zo);var js,vi=(js=class extends J{constructor(e,t,i){super("DynamicWidgetDialog"),this.dynamicPageService=e,this.lazyTypeService=t,this.view=i,this.alignment=vt,this.listLabel="Choose which set of users this widget should be visible for.",this.isEditable=!0}ngOnInit(){this.initModalDialog(),this.update()}selectWidget(){this.isDialogOpen||(this.isDialogOpen=!0,this.lazyTypeService.injectLazyService("CatalogStartService").then(e=>{let t={isSelect:!0,onlyPublished:!0,isBanner:this.isBanner,bannerWidgetCount:0,addCallback:i=>{e.closeCatalog(),this.widget=this.toWidget(i.item),this.update()}};this.openCatalog(e,t)},e=>{this.isDialogOpen=!1}))}openCatalog(e,t){e.openWidgetCatalog(t,this.view).pipe(rt(()=>{this.isDialogOpen=!1})).subscribe()}save(){if(!this.isEditable)return;let e=this.container,t=v.copy(this.widget);t.eid||(t.eid=x.getNewEntityId(e)),this.expressions?(t.as=1,t.ais=x.toIds(this.expressions),t.op=x.getOperator(this.expressions)):this.selectedExpressions&&(t.as=null,t.ais=null),this.isEdit?this.submitSafe(this.dynamicPageService.editContainerEntity(this.container,t,this.oldWidget),!1,!0).subscribe(()=>this.modalDialog.close(t)):this.submitSafe(this.dynamicPageService.addContainerEntity(this.container,t),!1,!0).subscribe(()=>this.modalDialog.close(t))}update(){this.canSave=!!this.widget}toWidget(e){let t={h:this.toHandle(e),t:e.title};return e.banner&&(t.bl=e.banner),t}toHandle(e){let t={id:e.widgetId};return e.standardWidgetId&&(t.pid=e.standardWidgetId),t}},js.ctorParameters=()=>[{type:F},{type:un},{type:A}],js.propDecorators={isBanner:[{type:h}]},js);vi=d([p({template:Sd})],vi);var Ys,Ln=(Ys=class{constructor(e){this.pageService=e,this.isAddDisabled=!1,this.localizationChange=new V,this.entityCategory=ne.dynamicPage}ngOnInit(){let e=this.pageService.getPage();this.pageLangs=e?e.lngs:null,this.optionsItems||(this.optionsItems=[{label:"placeholder",name:"placeholder",maxLength:I.dynPageDefaultMaxLength}]);let t=this.optionsItems,i=this.lznEntityMap?this.convertToLocalizationStringMap(this.lznEntityMap):{};this.addExistingLanguagesOnPage(i),this.translationEntity={translationOptions:{items:t},localizationMap:i,enablePortation:!1}}ngOnChanges(e){if(e.entity&&!e.entity.firstChange){let t=e.entity.currentValue,i=this.translationEntity.translationOptions.items;for(let s of Object.keys(t)){let a=u.itemByProperty(i,"name",s);a&&(a.defaultValue=t[s])}}e.optionsItems&&!e.optionsItems.firstChange&&(this.translationEntity.translationOptions.items=e.optionsItems.currentValue,this.translationEntity=D({},this.translationEntity))}onLocalizationChange(e){let t=this.convertToEntityLocalizationMap(e);this.localizationChange.emit(t)}convertToLocalizationStringMap(e){let t={};for(let i of Object.keys(e)){let s=e[i];if(s.op!==pe.Delete){let a=this.optionsItems.filter(o=>o.name&&o.name.length).reduce((o,n)=>(o[n.name]=s[n.name]||"",o),{});t[i]=a}}return t}convertToEntityLocalizationMap(e){let t={};for(let i of e)this.addLocalizationForLanguage(i,t);if(this.lznEntityMap)for(let i of Object.keys(this.lznEntityMap)){let s=this.lznEntityMap[i]&&this.lznEntityMap[i].op===pe.Delete;!u.itemByProperty(e,"language",i)&&!s&&(t[i]={op:pe.Delete})}return t}addLocalizationForLanguage(e,t){let i=e.language,s=e.localization;if(this.isExistingLanguage(i)&&this.isPlaceholder(s))return;let a=this.lznEntityMap?this.lznEntityMap[i]:null;(!a||this.isNewLocalization(a,s))&&(t[i]=this.createEntityLocalization(s))}createEntityLocalization(e){let t=this.optionsItems.filter(i=>i.name&&i.name.length).reduce((i,s)=>(i[s.name]=e[s.name],i),{});return te(D({},t),{eid:this.entityId,op:pe.Update})}isExistingLanguage(e){return this.pageLangs&&this.pageLangs.indexOf(e)>-1}isPlaceholder(e){for(let t of this.optionsItems.map(i=>i.name))if(e[t]&&e[t].length)return!1;return!0}isNewLocalization(e,t){for(let i of this.optionsItems.map(s=>s.name))if(e[i]!==t[i])return!0;return!1}addExistingLanguagesOnPage(e){let t=this.pageLangs;if(t)for(let i of t)e[i]||(e[i]={placeholder:""})}},Ys.ctorParameters=()=>[{type:F}],Ys.propDecorators={lznEntityMap:[{type:h,args:["localizations"]}],entityId:[{type:h}],optionsItems:[{type:h}],isAddDisabled:[{type:h}],localizationChange:[{type:U}]},Ys);Ln=d([p({selector:"lm-dynamic-page-translations",template:`
		<p *ngIf="isAddDisabled">There is nothing to translate.</p>
		<lm-translations-component
			*ngIf="!isAddDisabled"
			[parameter]="translationEntity"
			[category]="entityCategory"
			(localizationChange)="
				onLocalizationChange($event)
			"></lm-translations-component>
	`})],Ln);var $s,Nn=($s=class extends q{constructor(e,t,i,s,a,o,n){super("DynamicUserPropertiesComponent","user property",e,t,i,s,a),this.commonService=o,this.changeDetector=n,this.selectedProperty=new V,this.selectedCategory=da.Standard,this.attributeCategories=da}ngOnInit(){this.initGrid(),this.refresh()}getDataGrid(){return this.dataGrid}updateSelection(e){super.updateSelection(e),this.selectedProperty.emit(this.selected)}listItems(e){let t=this.commonService.listAttributes(e);this.withBusy(t).subscribe(i=>{i&&i.content&&(this.updateItems(i.content),this.updateDataSet(),this.changeDetector.detectChanges())},i=>{this.onError(i)})}updateSelectedCategory(e){let t=e.tab|e.tab.id;this.selectedCategory!==t&&(this.selected&&this.dataGrid&&this.dataGrid.unSelectAllRows(),this.selectedCategory=t,this.updateDataSet())}updateDataSet(){this.datagridOptions.dataset=this.items.filter(e=>e.category===this.selectedCategory)}initGrid(){let e={selectable:"single",rowHeight:"medium",disableRowDeactivation:!0,clickToSelect:!1,columns:[this.getSelectionColumn(),{width:205,id:"adm-up-col-p",field:"name",name:"Property",sortable:!1,resizable:!0},{width:200,id:"adm-up-col-dt",field:"type",name:"Data type",sortable:!1,resizable:!0,formatter:S.propertyDataType}],dataset:[],emptyMessage:{title:"No user properties found",icon:I.adminEmptyDatagridIcon}};this.datagridOptions=e}},$s.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:xe},{type:Ii}],$s.propDecorators={dataGrid:[{type:f,args:["propertiesDataGrid",{static:!1}]}],selectedProperty:[{type:U}]},$s);Nn=d([p({selector:"lm-user-properties",template:`
		<div
			class="lm-display-flex"
			soho-tabs
			(beforeActivated)="updateSelectedCategory($event)">
			<div soho-tab-list-container>
				<ul soho-tab-list>
					<li soho-tab>
						<a
							soho-tab-title
							tabId="Additional"
							[id]="attributeCategories.Additional"
							>Additional</a
						>
					</li>
					<li soho-tab>
						<a
							soho-tab-title
							tabId="Standard"
							[id]="attributeCategories.Standard"
							>Standard</a
						>
					</li>
				</ul>
			</div>
			<button
				soho-button="icon"
				icon="refresh"
				(click)="refresh()"
				soho-tooltip
				title="Refresh">
				<span class="audible">Refresh</span>
			</button>
		</div>
		<div
			soho-datagrid
			#propertiesDataGrid
			id="gridSelectProperty"
			[gridOptions]="datagridOptions"
			[data]="datagridOptions.dataset"
			(selected)="updateSelection($event.rows)"></div>
	`,changeDetection:Si.OnPush})],Nn);var Cd=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div class="field">\r
		<label for="autocomplete-private-pages">Search</label>\r
		<div class="searchfield-wrapper">\r
			<input\r
				soho-searchfield\r
				class="lm-autocomplete-searchfield input-lg"\r
				id="autocomplete-private-pages"\r
				[placeholder]="placeholder"\r
				maxlength="254"\r
				[options]="searchfieldOptions"\r
				[(ngModel)]="searchQuery"\r
				[class.lm-clearable]="searchQuery"\r
				[source]="autocompleteSource"\r
				[template]="autocompleteTemplate"\r
				(selected)="onSelected($event)"\r
				(lm-submit)="onSearch()"\r
				(cleared)="clearSearch()"\r
				(keydown.esc)="clearSearch()" />\r
		</div>\r
	</div>\r
\r
	<soho-toolbar-flex *ngIf="showToolbar" (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-prp-user"\r
			>{{ flexToolbarTitle }}</soho-toolbar-flex-section\r
		>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<ng-container *ngIf="selectedUser">\r
				<button\r
					soho-button="tertiary"\r
					icon="export"\r
					[disabled]="!items.length"\r
					data-action="exportAll"\r
					id="lm-a-prp-exportall">\r
					Export All\r
				</button>\r
				<button\r
					soho-button="tertiary"\r
					icon="import"\r
					data-action="importPages"\r
					id="lm-a-prp-import">\r
					Import\r
				</button>\r
				<div class="separator"></div>\r
			</ng-container>\r
			<button\r
				soho-button="icon"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh"\r
				id="lm-a-prp-refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div *ngIf="selectionCount > 0" class="contextual-toolbar toolbar">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				icon="delete"\r
				(click)="deletePages()"\r
				id="lm-a-prp-delete">\r
				Delete ({{ selectionCount }})\r
			</button>\r
			<button\r
				*ngIf="isUserCategorySelected"\r
				soho-button="tertiary"\r
				icon="export"\r
				(click)="exportPages()"\r
				id="lm-a-prp-export">\r
				Export ({{ selectionCount }})\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		*ngIf="showGrid"\r
		id="adminPrivatePagesGrid"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"></div>\r
</div>\r
`;var Hs,Wo=(Hs=class extends q{get isUserCategorySelected(){return this.selectedCategory==="user"}get isPageTitleCategorySelected(){return this.selectedCategory==="pageTitle"}get placeholder(){return this.isUserCategorySelected?"Search for a user":"Search for a private page"}get showToolbar(){return this.showGrid}get flexToolbarTitle(){if(this.isUserCategorySelected&&this.selectedUser)return`${this.selectedUserDisplayName} - ${this.selectedUserEmail}`}get showGrid(){return this.isUserCategorySelected?!!this.selectedUser:this.isPageTitleCategorySelected?!!this.query:!1}constructor(e,t,i,s,a,o,n){super("AdminPrivatePagesComponent","private page",t,i,e,s,a),this.adminService=e,this.commonDataService=o,this.viewRef=n,this.selectedCategory="user",this.initAutocomplete(),this.initSearchFieldOptions(),this.updateGridOptions()}ngOnInit(){this.selectedUser&&this.refresh()}listItems(e){if(this.isBusy)return;this.setBusy(!0),e&&(this.items=[],this.updateGridData());let t=this.isUserCategorySelected?this.selectedUser:this.searchQuery,i=this.adminService;i.listPrivatePages(t,e,this.isPageTitleCategorySelected).subscribe(s=>{this.onItems(s.content),this.updateGridData(),this.setBusy(!1)},s=>{i.handleError(s),this.setBusy(!1)})}importPages(){let e="Import Private Pages",t=this.adminService,i={title:e,operation:ne.privatePage.toString()},s={};s.userId=this.selectedUser,i.formFields=s,t.openImportFilesDialog(i,this.viewRef).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,o.message).subscribe(n=>{n.button===C.Ok&&this.refresh()}):a.button===C.Yes&&o.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,o.message,!0)})}exportPages(){if(this.selectionCount===this.items.length)this.exportAll();else{let e=this.getSelectedItems();this.adminService.exportPrivatePages(this.selectedUser,e)}}exportAll(){this.adminService.exportPrivatePages(this.selectedUser)}deletePages(){let e=this.getSelectedItems(),t=this.adminService.getDeletePageOptions(e,!0,this.isPageTitleCategorySelected);this.showConfirm(t.title,t.message).subscribe(()=>{this.deletePrivatePage(e)})}onSelected(e){e[2]?this.isUserCategorySelected&&this.onUserSelect(e):this.onCategorySelected()}onCategorySelected(){let t=(this.searchfield.getCategoryData(!0)||[])[0].id==="autocomplete-private-pages-user"?"user":"pageTitle";t!==this.selectedCategory&&(this.selectedCategory=t,this.clearSearch(),this.clearSelection(),this.updateGridOptions())}onSearch(){this.isPageTitleCategorySelected&&(this.query=this.searchQuery,this.search())}onUserSelect(e){if(e[2]){let t=e[2];if(W.isUndefined(t)||W.isUndefined(t.value))return;this.selectedUser=t.value,this.selectedUserEmail=t.info,this.selectedUserDisplayName=t.label,this.refresh()}}clearSearch(){this.searchQuery=null,this.selectedUser=null,this.selectedUserEmail=null,this.selectedUserDisplayName=null,this.clearSelection(),this.isPageTitleCategorySelected&&super.clearSearch(!1)}getDataGrid(){return this.privatePagesDataGrid}onItems(e){this.items=e,this.items.forEach(t=>{this.isUserCategorySelected?t.data.title=oe.escapeStringForHtml(t.data.title):t.title=oe.escapeStringForHtml(t.title)})}deletePrivatePage(e){let t=e.map(i=>this.isUserCategorySelected?i.data.id:i.title);this.setBusy(!0),this.adminService.deletePrivatePages(t,this.isPageTitleCategorySelected).subscribe(i=>{if(this.setBusy(!1),i.content>0&&(this.refresh(),this.isPageTitleCategorySelected)){let s=this.adminService.getPageDeletedForUsersConfirmationOptions(t[0],i.content);this.showMessage(s.title,s.message)}},i=>{this.adminService.handleError(i),this.setBusy(!1)})}initAutocomplete(){this.autocompleteSource=(e,t)=>{this.onAutoComplete(e,t)},this.autocompleteTemplate=Re.autocompleteEntity}onAutoComplete(e,t){if(this.isPageTitleCategorySelected)return;let i=e.trim();if(!i){t(e,[]);return}this.commonDataService.searchUsers(i).subscribe(s=>{t(i,u.sortByProperty(v.getEntityArray(we.User,s.content),"label"))},s=>{this.commonDataService.handleError(s)})}initSearchFieldOptions(){this.searchfieldOptions={filterMode:"contains",attributes:[{name:"name",value:"lm-a-private-pages-search"}],clearable:!0,showCategoryText:!0,showAllResults:!1,categories:[{id:"autocomplete-private-pages-user",name:"User",checked:!0},{id:"autocomplete-private-pages-pageTitle",name:"Page Title",checked:!1}]}}updateGridOptions(){let e=this.isUserCategorySelected?this.defaultGridOptions:this.pageCountGridOptions;this.datagridOptions=te(D({},e),{emptyMessage:{title:"No private pages found",icon:I.adminEmptyDatagridIcon}})}get defaultGridOptions(){return{selectable:"multiple",rowTemplate:'<div class="datagrid-cell-layout"><span class="datagrid-textarea lm-white-space-normal">{{data.description}}</span></div>',filterable:!0,disableRowDeactivation:!0,clickToSelect:!1,columns:[this.getSelectionColumn(),{width:595,id:"adm-pp-col-t",field:"data.title",name:"Title",resizable:!0,sortable:!0,filterType:"text",formatter:Formatters.Expander},{width:200,id:"adm-pp-col-on",field:"data.ownerName",name:"Owner",resizable:!0,sortable:!0,filterType:"text",formatter:S.displayName},{width:200,id:"adm-pp-col-cd",field:"data.changeDate",name:"Change date",resizable:!0,sortable:!0,filterType:"text",formatter:S.date},{width:200,id:"adm-pp-col-cbn",field:"data.changedByName",name:"Changed by",resizable:!0,sortable:!0,filterType:"text",formatter:S.displayName}]}}get pageCountGridOptions(){return{selectable:"single",stretchColumn:"adm-pp-col-t",columns:[this.getSelectionColumn(),{id:"adm-pp-col-t",field:"title",name:"Title",sortable:!1},{width:250,id:"adm-pp-col-count",field:"popularity",name:"Number of pages",sortable:!1}]}}},Hs.ctorParameters=()=>[{type:y},{type:b},{type:L},{type:w},{type:B},{type:xe},{type:A}],Hs.propDecorators={privatePagesDataGrid:[{type:f,args:[Ai,{static:!1}]}],searchfield:[{type:f,args:[Pi,{static:!0}]}]},Hs);Wo=d([p({selector:"lm-admin-private-pages",template:Cd})],Wo);var Id=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-pp-maxtitle">\r
			<svg\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				soho-tooltip\r
				[title]="quotaTitle"\r
				*ngIf="isCloseToMaxQuota"\r
				id="lm-a-pp-maxicon"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="admin-published-pages-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				icon="sort-down"\r
				[disabled]="toolbarDisabled"\r
				menu="lmAdminPublishedPagesSort"\r
				class="btn-menu"\r
				type="button"\r
				id="lm-a-pp-sort-button">\r
				<span>{{ orderBy.name }}</span>\r
			</button>\r
			<ul soho-popupmenu id="lmAdminPublishedPagesSort" class="popupmenu top">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-pp-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminPublishedPagesFilter"\r
				[disabled]="toolbarDisabled"\r
				class="btn-menu"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip"\r
				id="lm-a-pp-filter">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popupmenu id="lmAdminPublishedPagesFilter" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[(isChecked)]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-pp-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="tertiary"\r
				icon="export"\r
				[disabled]="!items.length"\r
				data-action="exportAll"\r
				id="lm-a-pp-exportall">\r
				Export All\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="import"\r
				data-action="onImport"\r
				*ngIf="!isReadOnly"\r
				id="lm-a-pp-import">\r
				Import\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh"\r
				id="lm-a-pp-refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div>\r
		<ul soho-popupmenu id="lmAdminPublishedPagesPermissions">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-edit-permissions"\r
					(click)="editAccess()"\r
					>Edit Permissions</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1 || selected.accessState === 3">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-copy-permissions"\r
					(click)="copyAccess()"\r
					>Copy Permissions</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-apply-permissions"\r
					(click)="applyAccessCopy()"\r
					>Apply Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-replace-permissions"\r
					(click)="replacePageAccess()"\r
					>Replace Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount === 1 && selected.accessState === 3">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-clear-permissions"\r
					(click)="clearPageAccess()"\r
					>Clear Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
		<ul soho-popupmenu id="lmAdminPublishedPagesMore">\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1"\r
				*ngIf="!isReadOnly">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-publish-toexisting"\r
					(click)="publishExisting()"\r
					>Publish to Existing Page</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a soho-popupmenu-label id="lm-a-pp-preview" (click)="preview()"\r
					>Preview Page</a\r
				>\r
			</li>\r
			<li soho-popupmenu-separator></li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1"\r
				*ngIf="!isReadOnly">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-take-ownership"\r
					(click)="takeOwnership()"\r
					>Take Ownership</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1"\r
				*ngIf="!isReadOnly">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-change-ownership"\r
					(click)="changeOwnership()"\r
					>Change Ownership</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pp-open-incatalog"\r
					(click)="openInCatalog()"\r
					>Open in Catalog</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				icon="delete"\r
				(click)="onDelete()"\r
				*ngIf="!isReadOnly"\r
				id="lm-a-pp-delete">\r
				Delete ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="export"\r
				(click)="onExport()"\r
				id="lm-a-pp-export">\r
				Export ({{ selectionCount }})\r
			</button>\r
			<div class="separator" *ngIf="!isReadOnly"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminPublishedPagesPermissions"\r
				type="button"\r
				id="lm-admin-pp-permissions"\r
				*ngIf="!isReadOnly">\r
				<span>Permissions</span>\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminPublishedPagesMore"\r
				type="button"\r
				id="lm-admin-pp-more">\r
				<span>More</span>\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#publishedPagesDatagrid\r
		id="gridPublishedPages"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-pp-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a soho-hyperlink id="lm-a-pp-clear-filters" (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var qs,Go=(qs=class extends q{constructor(e,t,i,s,a,o,n,r,l,c,g){super("AdminPublishedPagesComponent","page",e,t,i,s,a,{sortUsedBy:!0,isFilter:!0}),this.adminContext=o,this.toastService=n,this.pageService=r,this.progressService=l,this.containerService=c,this.viewRef=g,this.datagridOptions=this.defaultOptions()}ngOnInit(){this.initializing&&this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.currentUser=e.userId,this.maxCount=e.maxCountPublishedPage||0,this.isReadOnly=E.isReadOnlyUser(e)}),this.refresh()}ngAfterViewInit(){let e=this.getDataGrid();e&&(this.unsubscriber=e.selected.subscribe(t=>{this.deSelectDynamic(t.rows)}))}ngOnDestroy(){this.unsubscriber&&this.unsubscriber.unsubscribe()}getDataGrid(){return this.dataGrid}listItems(e){let t=this.createRequest(e);if(!t)return;let i=t.query;v.isGuid(i)&&(t.entityId=i,t.query=null,t.includeStandard=!1);let s=this,a=s.adminService,o=a.listPublishedPages(t);this.withBusy(o).subscribe(n=>{let r=n.content;s.addItems(r,n.paging),s.updateCount(n.count,this.maxCount)},n=>{a.handleError(n)})}onImport(){let e="Import Published Pages",t=this.adminService,i={title:e,operation:ne.publishedPage.toString(),showStrategySelector:!0},s=this;t.openImportFilesDialog(i,this.viewRef).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,o.message).subscribe(n=>{n.button===C.Ok&&s.refresh()}):a.button===C.Yes&&o.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,o.message,!0)})}onExport(){let e=this.getSelectedItems();this.adminService.exportPublishedPages(e),this.clearSelection()}exportAll(){this.showConfirm("Confirm export all","Are you sure that you want to export all published pages?").subscribe(()=>{this.adminService.exportPublishedPages()})}onDelete(){let e=this.getSelectedItems(),t=this.adminService.getDeletePageOptions(e,!1);this.showConfirm(t.title,t.message).subscribe(()=>{this.deletePublishedPage(e)})}takeOwnership(){let e=this.getSelectedItem(),t=this;this.setBusy(!0),this.adminService.updatePageOwner({id:e.data.id}).subscribe(()=>{this.setBusy(!1),this.refresh()},i=>{t.onError(i)})}changeOwnership(){let e=this.getSelectedItem(),t={title:e.data.title,currentOwnerId:e.data.ownerId,itemId:e.data.id,callback:()=>this.refresh(),isWidget:!1};this.adminService.openChangeOwnerDialog(t,this.viewRef)}editAccess(){let e=this.getSelectedItem();if(e){let t=xt.publishedPages(this.languageService,e);t.callback=()=>this.refresh(),this.adminService.openPageAccessDialog(t,this.viewRef)}}copyAccess(){let e=this.getSelectedItem(),t=this,i=t.adminService;this.setBusy(!0),i.getPageAccess(e.data.id).subscribe(s=>{t.accessCopy=t.setDefaultCreateOperation(s.content),t.accessCopyPageId=e.data.id,t.setBusy(!1)},s=>{i.handleError(s),t.setBusy(!1)})}applyAccessCopy(){let e=this.getSelectedItems();this.adminService.applyPageAccess(e,this.accessCopy,()=>{this.refresh()})}clearPageAccess(){let e=this.getSelectedIds();e.length!==0&&this.adminService.clearPageAccessPages(e).subscribe(null,t=>{this.logError("Clear page access error",t),this.refresh()},()=>{this.logInfo("Clear page access complete"),this.refresh()})}replacePageAccess(){try{let e=this.accessCopy,t=this.getSelectedIds();this.validatePageCopyAccessSelection(e,t),this.adminService.replacePageAccess(e,t,t.length).subscribe(()=>{},()=>{},()=>{this.refresh()})}catch(e){this.logError("Failed to replace page access",e)}}publishExisting(){let e=this.getSelectedItem(),t={title:"Select published page",isMultiSelect:!1,pageType:Ni.Published,noShowIds:[e.data.id],includeStandard:!1,excludeDynamic:!0,defaultButtonText:"Save"},i=s=>{let a=new Ce,o=s[0].data.id,n=e.data.id;if(n===o)this.adminService.showError("Unable to publish to existing page","Same source as target"),a.error(null);else{let r=this;this.adminService.publishToExisting(n,o).subscribe(l=>{if(l.hasError()){let c=`Unable to publish page with id:${n} to existing page with id:${o}`;r.adminService.handleError(l,c),a.error(null)}else r.clearSelection(),r.toastService.show({title:"Published to Existing",message:"Published page was succesfully updated.",position:Ie.BOTTOM_RIGHT}),a.next(null),a.complete()},()=>{r.adminService.showError("Unable to publish to existing page","The requested operation failed."),a.error(null)})}return a.asObservable()};this.adminService.openPageSelectorDialog(t,"Publish to existing Page",this.viewRef,i).subscribe(s=>{s&&s.button===C.Ok&&this.refresh()})}preview(){let e=this.getSelectedItem(),t=this.containerService,i={pageId:e.data.id,isDuplicatable:!0,isAddable:!0,notifyMingle:!0,onClose:()=>{t.showAdmin()}};this.progressService.onNextNotBusy(()=>t.hideAdmin(T.PublishedPages)),this.pageService.previewPage(i)}onExpandRow(e){let t=e.item,i=t.data,s=$(e.detail).find(".datagrid-row-detail-padding").empty(),a=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${this.escape(i.description)}</span>`;if(i.tags){a+='<div class="lm-margin-lg-t"><span>';let o=i.tags.split("#");o.shift();for(let n of o)a+=`<a class="tag lm-margin-sm-r">${n}</a>`;a+="</span></div>"}t.err&&t.err.pageError===_t.DynamicPagesFeatureOff&&(a+=this.getErrorMessageTemplate(fe.formatAlert(I.dynPageFeatureOffMsg,!0))),a+="</div>",$(s).append($(a))}openInCatalog(){this.pageService.showPageCatalog(this.getSelectedItem()),this.containerService.hideAdmin(this.adminService.getLastVisitedTab())}getColumns(){let e=(t,i,s,a,o,n)=>{let r=o.data;return r&&r.isDynamic?"":Formatters.SelectionCheckbox(t,i,s,a,o,n)};return[te(D({},this.getSelectionColumn()),{formatter:e}),{width:445,id:"adm-pp-col-t",field:"data.title",name:"Title",resizable:!0,filterType:"text",sortable:!1,formatter:S.dynamicDisabledExpander},{width:175,id:"adm-pp-col-on",field:"data.ownerName",name:"Owner",resizable:!0,filterType:"contentes",sortable:!1,formatter:S.displayName},{width:200,id:"adm-pp-col-cd",field:"data.changeDate",name:"Change date",resizable:!0,sortable:!1,formatter:S.date},{width:175,id:"adm-pp-col-cbn",field:"data.changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName},{width:90,id:"adm-pp-col-p",field:"popularity",name:"Used by",sortable:!1},{width:110,id:"adm-pp-col-as",field:"accessState",name:"Permissions",sortable:!1,formatter:S.accessState}]}getEmptyMessage(){return"No published pages found"}deSelectDynamic(e){if(e){let t=this.getDataGrid();for(let i of e)i.data.data.isDynamic&&t.unselectRow(i.idx)}}updateOwner(e,t){e.ownerId=t.ownerId,e.ownerName=t.ownerName,e.changedByName=t.changedByName,e.changeDate=t.changeDate,this.clearSelection()}setDefaultCreateOperation(e){let t=e.access;if(t){e.access=[];for(let i of t)i.operation=pe.Create,e.access.push(i)}return e}validatePageCopyAccessSelection(e,t){if(!e)throw new Error("No data to copy");if(!t||t.length===0)throw new Error("No selected pages")}getSelectedIds(){let e=this.getSelectedItems();if(!e)return[];let t=[];for(let i of e)t.push(i.data.id);return t}deletePublishedPage(e){let t=this.adminService;this.setBusy(!0);let i=this,s=e.map(a=>a.data.id);this.pageService.deletePublished(s).subscribe(a=>{i.setBusy(!1),a.content>0&&i.refresh()},a=>{i.setBusy(!1),t.handleError(a,a.getErrorMessages())})}},qs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:Ie},{type:Rt},{type:dt},{type:Fe},{type:A}],qs.propDecorators={dataGrid:[{type:f,args:["publishedPagesDatagrid",{static:!1}]}]},qs);Go=d([p({selector:"lm-admin-published-pages",template:Id})],Go);var wd=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<!-- Add a warning if standard pages isn't enabled -->\r
	<div\r
		class="lm-admin-quota-message lm-margin-xl-b lm-pull-none"\r
		*ngIf="featureStandardPagesOn === false">\r
		<svg\r
			class="icon icon-alert"\r
			focusable="false"\r
			aria-hidden="true"\r
			role="presentation"\r
			id="lm-a-stp-dicon">\r
			<use xlink:href="#icon-alert"></use>\r
		</svg>\r
		<p class="lm-pull-left" id="lm-a-stp-dmessage">\r
			Standard pages are disabled and will not be available in the Page Catalog.\r
			Enable the Standard Pages feature in the\r
			<a\r
				id="lm-a-stp-dlink"\r
				class="hyperlink"\r
				href=""\r
				(click)="goToFeaturesPage($event)"\r
				>Features page</a\r
			>.\r
		</p>\r
	</div>\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="admin-standard-pages-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<!-- Sort -->\r
			<button\r
				soho-menu-button\r
				icon="sort-down"\r
				menu="lmAdminStandardPagesSort"\r
				[disabled]="toolbarDisabled"\r
				type="button">\r
				<span>{{ orderBy.name }}</span>\r
			</button>\r
			<ul soho-popupmenu id="lmAdminStandardPagesSort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-stp-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div>\r
		<ul soho-popupmenu id="lmAdminStandardPagesPermissions">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-stp-edit-permissions"\r
					(click)="editAccess()"\r
					>Edit Permissions</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item>\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-stp-reset-permissions"\r
					(click)="reset()"\r
					>Reset Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
		<ul soho-popupmenu id="lmAdminStandardPagesMore">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-stp-publish-ascopy"\r
					(click)="publishCopy()"\r
					>Publish as Copy</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-stp-pubilsh-toexisting"\r
					(click)="publishExisting()"\r
					>Publish to Existing Page</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a soho-popupmenu-label id="lm-a-stp-preview" (click)="preview()"\r
					>Preview Page</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-stp-open-incatalog"\r
					(click)="openInCatalog()"\r
					>Open in Catalog</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button soho-button="tertiary" icon="export" (click)="onExport()">\r
				Export ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="subscribe"\r
				[disabled]="!canEnable()"\r
				(click)="enable()">\r
				Enable ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="unsubscribe"\r
				[disabled]="!canDisable()"\r
				(click)="disable()">\r
				Disable ({{ selectionCount }})\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminStandardPagesPermissions"\r
				type="button"\r
				id="lm-admin-sp-permissions">\r
				<span>Permissions</span>\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminStandardPagesMore"\r
				type="button"\r
				id="lm-admin-sp-more">\r
				<span>More</span>\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#standardPagesDatagrid\r
		id="gridStandardPages"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-stp-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive"\r
				>There are active filters.\r
				<a\r
					soho-hyperlink\r
					id="lm-a-stp-clear-filters"\r
					(click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Qs,Vo=(Qs=class extends q{constructor(e,t,i,s,a,o,n,r,l,c,g,P){super("AdminStandardPagesComponent","page",e,t,i,s,a),this.adminContext=o,this.pageService=n,this.toastService=r,this.progressService=l,this.containerService=c,this.viewRef=g,this.settingsService=P,this.onGoToFeatures=new V,this.subscriptions=new nt,this.subscriptions.add(this.settingsService.features$.subscribe(z=>{let Z=u.itemByProperty(z,"settingName",K.featureStandardPages);Z&&(this.featureStandardPagesOn=Z.value==="true")})),this.initGrid()}ngOnInit(){this.initializing&&this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.featureStandardPagesOn=e.featureStandardPages}),this.refresh()}ngOnDestroy(){this.subscriptions.unsubscribe()}getDataGrid(){return this.dataGrid}canEnable(){return this.checkSelection(e=>e.accessState===Zt.None||e.accessState===Zt.Restricted)}canDisable(){return this.checkSelection(e=>e.accessState===Zt.Everyone||e.accessState===Zt.Restricted)}listItems(e){if(this.isBusy)return;let t=this,i=t.adminService;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let s=this.orderBy,a=this.getQuery(),o={paging:this.paging,pageSize:this.pageSize,sortOrder:s.order,sortBy:s.entity,query:a};i.listStandardPages(o).subscribe(n=>{let r=n.content;t.addItems(r,n.paging),t.updateCount(n.count,this.maxCount),t.setBusy(!1)},n=>{t.setBusy(!1),t.onError(n)})}enable(){this.executeAction(this.enablePages,"Enable standard pages",this.getAreYouSureMessage("enable"))}disable(){this.executeAction(this.disablePages,"Disable standard pages",this.getAreYouSureMessage("disable"))}reset(){this.executeAction(this.resetPagesAccess,"Reset standard page permissions",this.getAreYouSureMessage("reset"))}publishCopy(){let e=this.getSelectedItem(),t=this;this.adminService.publishStandardCopy(e.data.id).subscribe(i=>{i.hasError()?t.adminService.handleError(i,"Unable to publish copy"):(t.clearSelection(),t.toastService.show({title:"Published Copy",message:`A published copy of ${e.data.title} has been created.`,position:Ie.BOTTOM_RIGHT}))},i=>{t.adminService.handleError(i)})}publishExisting(){let e=this.getSelectedItem(),t={title:"Select published page",isMultiSelect:!1,pageType:Ni.Published,noShowIds:[e.data.id],includeStandard:!1,excludeDynamic:!0},i=s=>{let a=new Ce,o=s[0].data.id,n=e.data.id;if(n===o){this.adminService.showError("Unable to publish to existing page","Same source as target");return}let r=this;return this.adminService.publishToExisting(n,o).subscribe(l=>{if(l.hasError()){let c=`Unable to publish page with id:${n} to existing page with id:${o}`;r.adminService.handleError(l,c),a.error(null)}else r.clearSelection(),r.toastService.show({title:"Published to Existing",message:"Published page was succesfully updated.",position:Ie.BOTTOM_RIGHT}),a.next(null),a.complete()},()=>{r.adminService.showError("Unable to publish to existing page","The requested operation failed."),a.error(null)}),a.asObservable()};this.adminService.openPageSelectorDialog(t,"Publish to existing Page",this.viewRef,i)}preview(){let e=this.getSelectedItem(),t=e.accessState===Zt.None,i=this.containerService,s={pageId:e.data.id,isDuplicatable:!t,isAddable:!t,notifyMingle:!0,onClose:()=>{i.showAdmin()}};this.progressService.onNextNotBusy(()=>i.hideAdmin(T.StandardPages)),this.pageService.previewPage(s)}onExport(){let e=this.getSelectedItems();this.adminService.exportStandardPages(e),this.clearSelection()}exportAll(){}editAccess(){let e=this.getSelectedItem();if(!e)return;let t=xt.standardPages(this.languageService,e);t.callback=()=>this.refresh(),this.adminService.openPageAccessDialog(t,this.viewRef)}goToFeaturesPage(e){e.preventDefault(),this.onGoToFeatures.emit(T.Features)}openInCatalog(){this.pageService.showPageCatalog(this.getSelectedItem()),this.containerService.hideAdmin(this.adminService.getLastVisitedTab())}getColumns(){return[this.getSelectionColumn(),{width:545,id:"adm-sp-col-t",field:"data.title",name:"Title",sortable:!1,formatter:S.dynamicDisabledExpander},{width:300,id:"adm-sp-col-i",field:"data.id",name:"Content ID",sortable:!1,formatter:S.text},{width:240,id:"adm-sp-col-cd",field:"data.changeDate",name:"Change date",sortable:!1,formatter:S.date},{width:110,id:"adm-sp-col-as",field:"accessState",name:"Permissions",sortable:!1,formatter:S.accessState}]}getEmptyMessage(){return"No standard pages found"}getRowTemplate(){return'<div class="datagrid-cell-layout"><span class="datagrid-textarea lm-white-space-normal">{{data.description}}</span></div>'}checkSelection(e){let t=this.getSelectedItems();if(t.length>0){for(let i of t)if(!e(i))return!1;return!0}return!1}enablePages(e,t){let i=t.adminService;i.enableStandardPages(e).subscribe(s=>{t.refresh(),t.toastService.show({title:"",position:Ie.BOTTOM_RIGHT,message:e.length>1?"The pages have been enabled.":e[0].data.title+" has been enabled."}),t.clearSelection()},s=>{t.setBusy(!1),i.handleError(s,e.length>1?"Unable to enable the selected pages.":"Unable to enable "+e[0].data.title)})}disablePages(e,t){let i=t.adminService;i.disableStandardPages(e).subscribe(s=>{t.refresh(),t.toastService.show({title:"",position:Ie.BOTTOM_RIGHT,message:e.length>1?"The pages have been disabled.":e[0].data.title+" has been disabled."}),t.clearSelection()},s=>{t.setBusy(!1),i.handleError(s,e.length>1?"Unable to disable the selected pages.":"Unable to disable "+e[0].data.title)})}resetPagesAccess(e,t){let i=t.adminService;i.resetStandardPagesAccess(e).subscribe(s=>{t.refresh(),t.toastService.show({title:"",position:Ie.BOTTOM_RIGHT,message:e.length>1?"The pages have been reset.":e[0].data.title+" has been reset."}),t.clearSelection()},s=>{t.setBusy(!1),i.handleError(s,e.length>1?"Unable to reset the selected pages.":"Unable to reset "+e[0].data.title)})}executeConfirmed(e,t,i){this.showConfirm(t,i).subscribe(()=>{e()})}getAreYouSureMessage(e){let t=this.getSelectedItems(),i=t[0].data.title,s=t.length>1,a="";switch(e){case"enable":{a=s?"Are you sure that you want to enable the selected pages?":"Are you sure that you want to enable "+i+"?";break}case"disable":{a=s?"Are you sure that you want to disable the selected pages?":"Are you sure that you want to disable "+i+"?";break}case"reset":{a=s?"Are you sure that you want to reset the permissions of the selected pages?":"Are you sure that you want to reset the permissions of "+i+"?";break}}return a}executeAction(e,t,i){let s=this.getSelectedItems();i=this.getConfirmMessage(i,s);let a=()=>{e(s,this)};this.executeConfirmed(a,t,i)}getConfirmMessage(e,t){return this.checkSelection(s=>s.accessState===Zt.Restricted)&&(e=e+" Existing permissions will be replaced."),e}showErrorMessage(e,t,i){this.showError(e,t),i&&i.hasMessage()&&this.logError(i.toErrorLog())}initGrid(){this.datagridOptions=this.defaultOptions()}},Qs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:Rt},{type:Ie},{type:dt},{type:Fe},{type:A},{type:be}],Qs.propDecorators={dataGrid:[{type:f,args:["standardPagesDatagrid",{static:!1}]}],onGoToFeatures:[{type:U}]},Qs);Vo=d([p({selector:"lm-admin-standard-pages",template:wd})],Vo);var Ad=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-sp-maxtitle">\r
			<svg\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				soho-tooltip\r
				[title]="quotaTitle"\r
				*ngIf="isCloseToMaxQuota"\r
				id="lm-a-sp-maxicon"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" for="lm-a-sp-search">Search</label>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="lm-a-sp-search"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				menu="lm-a-sp-sort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lm-a-sp-sort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-sp-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				menu="lm-a-sp-flt"\r
				[disabled]="toolbarDisabled"\r
				class="btn-menu"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popupmenu id="lm-a-sp-flt" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-sp-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				id="lm-a-sp-expa"\r
				soho-button="tertiary"\r
				icon="export"\r
				[disabled]="!items.length"\r
				data-action="exportAll">\r
				Export All\r
			</button>\r
			<button\r
				id="lm-a-sp-imp"\r
				*ngIf="isAdministrator"\r
				soho-button="tertiary"\r
				icon="import"\r
				data-action="importPolicies">\r
				Import\r
			</button>\r
			<ng-container *ngIf="isAdministrator">\r
				<div class="separator"></div>\r
				<button\r
					id="lm-a-sp-add"\r
					soho-button="tertiary"\r
					icon="add"\r
					data-action="add">\r
					Add Policy\r
				</button>\r
			</ng-container>\r
			<div class="separator"></div>\r
			<button\r
				id="lm-a-sp-ref"\r
				soho-button="icon"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<ng-container *ngIf="isAdministrator; else viewPolicy">\r
				<button\r
					id="lm-a-sp-edit"\r
					soho-button="tertiary"\r
					icon="edit"\r
					[disabled]="selectionCount !== 1"\r
					(click)="edit()">\r
					Edit\r
				</button>\r
				<button\r
					id="lm-a-sp-dlt"\r
					soho-button="tertiary"\r
					icon="delete"\r
					(click)="confirmDelete()">\r
					Delete ({{ selectionCount }})\r
				</button>\r
			</ng-container>\r
			<ng-template #viewPolicy>\r
				<button\r
					id="lm-a-sp-view"\r
					soho-button="tertiary"\r
					[disabled]="selectionCount !== 1"\r
					(click)="view()">\r
					View\r
				</button>\r
			</ng-template>\r
			<button\r
				id="lm-a-sp-exp"\r
				soho-button="tertiary"\r
				icon="export"\r
				(click)="exportSelected()">\r
				Export ({{ selectionCount }})\r
			</button>\r
			<ng-container *ngIf="isAdministrator">\r
				<div class="separator"></div>\r
				<button\r
					id="lm-a-sp-copy"\r
					soho-button="tertiary"\r
					icon="copy"\r
					[disabled]="selectionCount !== 1"\r
					(click)="copy()">\r
					Copy\r
				</button>\r
			</ng-container>\r
			<!-- TODO Make a drop down button -->\r
			<button\r
				soho-menu-button\r
				icon="update-preview"\r
				menu="lm-a-sp-usedby"\r
				type="button"\r
				id="lm-admin-p-usedby-menu-btn"\r
				[disabled]="selectionCount !== 1">\r
				<span>Used by</span>\r
			</button>\r
			<div>\r
				<ul soho-popupmenu id="lm-a-sp-usedby">\r
					<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-sp-usedby-memo"\r
							(click)="usedByAnnouncements()"\r
							>Announcements</a\r
						>\r
					</li>\r
					<li\r
						soho-popupmenu-item\r
						[hidden]="\r
							!(\r
								adminTool?.featureGlobalDynamicPages &&\r
								adminTool?.featureDynamicPages\r
							)\r
						"\r
						[isDisabled]="selectionCount !== 1">\r
						<a\r
							soho-popupmenu-label\r
							id="lm-a-sp-usedby-dp"\r
							(click)="usedByPages()"\r
							>Dynamic Pages</a\r
						>\r
					</li>\r
				</ul>\r
			</div>\r
		</div>\r
	</div>\r
\r
	<div\r
		#policiesDatagrid\r
		soho-datagrid\r
		id="lm-a-sp-grid"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-sp-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a id="lm-a-sp-clr" soho-hyperlink (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Js,_o=(Js=class extends q{constructor(e,t,i,s,a,o,n,r){super("AdminPoliciesComponent","policy",e,t,i,s,a,{isFilter:!0,isOwnerFilter:!1,isOtherUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Invalid",propertyName:"includeInvalid",value:!0,type:H.Custom}]}),this.commonService=o,this.adminContext=n,this.viewRef=r,this.onNavigationEvent=new V,this.importedUnsubscriber=i.onPoliciesImported().on(()=>{this.refresh()}),this.initGrid()}ngOnInit(){let e=this.adminContext.get();e&&(this.currentUser=e.userId,this.adminTool=e,this.isAdministrator=e.isAdministrator),this.refresh()}ngOnDestroy(){this.importedUnsubscriber()}getDataGrid(){return this.dataGrid}listItems(e){let t=this.createRequest(e);if(!t)return;let i=this.adminService,s=i.listExpressions(t);this.withBusy(s).subscribe(a=>{this.addItems(a.content,a.paging),this.updateCount(a.expCount,a.expCountAllowed)},a=>{i.handleError(a)})}exportSelected(){let e=this.getSelectedItems().map(t=>t.expressionId);e.length!==0&&this.adminService.exportExpressions(e)}exportAll(){this.adminService.exportExpressions()}importPolicies(){this.adminService.openPolicyImportDialog(this.viewRef).subscribe()}confirmDelete(){let e=this.selectionCount,t=E.pluralize("policy",e);this.showConfirm(`Delete ${t}`,`Are you sure that you want to delete the selected ${t}? The archive will not be checked for usages.`).subscribe(()=>{e===1?this.deleteSelected():this.deleteMultiSelected()})}showDeleteFailedInUse(e,t){this.showError("Unable to delete",t+" cannot be deleted. "+e+" Use the 'Used by' action to find the related entities").subscribe()}deleteSelected(){let e=this.getSelectedItem();if(e){this.setBusy(!0);let t={content:e.expressionId};try{this.adminService.deleteExpression(t).subscribe(()=>{this.refresh()},i=>{if(i.errorList&&i.errorList.length>0){let s=i.errorList[0];this.showDeleteFailedInUse(s.message,e.title)}else this.adminService.handleError(i)})}catch{}finally{this.setBusy(!1)}}}deleteMultiSelected(){let e=this.getSelectedItems();if(e){let t=[];for(let a of e){let o={content:a.expressionId},n=this.adminService.deleteExpression(o);t.push(n)}let i=this.sohoDialogService.modal(Ct,this.viewRef).title("Delete policies").id("lm-a-sp-delete-dialog").afterClose(()=>{this.refresh()}),s={customSuccessfulMessage:a=>`Deleted ${a} ${E.pluralize("policy",a)}.`,customFailedMessage:a=>`Failed to delete ${a} ${E.pluralize("policy",a)}.
					Policies in use cannot be deleted.`,entityname:"policy",operationName:"delete",operations:t};i.apply(a=>{a.modalDialog=i,a.options=s}).open()}}add(){this.isMaxQuota?this.showError("Add Policy","Unable to add policy since the maximum limit for allowed security policies has been reached."):this.openEditor(Se.Add)}edit(){this.openExistingPolicy(Se.Edit)}copy(){this.openExistingPolicy(Se.Copy)}view(){this.openExistingPolicy(Se.View)}openExistingPolicy(e){let t=this.createUniqueRequest();if(!t)return;let i=this.adminService.getExpression(t);this.withBusy(i).subscribe(s=>{this.openEditor(e,s.content)},s=>{this.adminService.handleError(s)})}openEditor(e,t){if(this.isEditorOpen)return;this.isEditorOpen=!0,t&&e===Se.Copy&&(t.title=t.title+" - Copy");let i=pt.getEditorTitle(e),s=this.sohoDialogService.modal(wt,this.viewRef).title(i).id("lm-a-sp-edit-dialog").suppressEnterKey(!0).afterClose(a=>{this.isEditorOpen=!1,a&&a.value&&(e===Se.Edit?this.updateItem(a.value):this.refresh())});s.apply(a=>{a.modalDialog=s,a.attributes=this.attributes||[],a.mode=e,a.policyEdit=t}).open()}usedByPages(){this.raiseNavigationEvent(T.DynamicPages)}usedByAnnouncements(){this.raiseNavigationEvent(T.Announcements)}raiseNavigationEvent(e){let t=this.createNavigationEventTarget(e);t&&this.onNavigationEvent.emit(t)}getColumns(){return[this.getSelectionColumn(),{width:745,id:"adm-pol-col-nm",field:"title",name:"Name",resizable:!0,sortable:!1},{width:200,id:"adm-pol-col-cd",field:"changeDate",name:"Change date",resizable:!0,sortable:!1,formatter:S.date},{width:250,id:"adm-pol-col-cb",field:"changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName}]}getEmptyMessage(){return"No policies found"}createNavigationEventTarget(e){let t=this.getSelectedItem();return t?{adminPage:e,entityId:t.expressionId,entityTitle:t.title}:null}updateItem(e){let t=this.items,i=u.indexByProperty(t,"expressionId",e.expressionId);i>=0&&(t[i]=e,this.items=[...t],this.updateGridData())}createUniqueRequest(){let e=this.getSelectedItem();return e&&!this.isBusy?{content:e.expressionId}:null}initGrid(){let e=this.defaultOptions();e.expandableRow=!1,this.datagridOptions=e}},Js.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:xe},{type:O},{type:A}],Js.propDecorators={dataGrid:[{type:f,args:["policiesDatagrid",{static:!1}]}],onNavigationEvent:[{type:U}]},Js);_o=d([p({selector:"lm-admin-policies",template:Ad})],_o);var Pd=`\uFEFF<div\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy">\r
	<div class="field">\r
		<label\r
			for="propertyName"\r
			class="label required"\r
			id="lm-a-prop-edit-name-label"\r
			>Name</label\r
		>\r
		<input\r
			*ngIf="isEdit === true"\r
			name="propertyName"\r
			[(ngModel)]="property.propertyId"\r
			readonly="true"\r
			id="lm-a-prop-edit-name" />\r
		<input\r
			*ngIf="isEdit === false"\r
			name="propertyName"\r
			[(ngModel)]="property.propertyId"\r
			maxlength="64"\r
			data-validate="required"\r
			soho-input\r
			soho-mask\r
			[options]="maskOptions"\r
			required\r
			id="lm-a-prop-edit-name" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="propertyArea" class="label">Area</label>\r
		<input\r
			id="propertyArea"\r
			name="propertyArea"\r
			[(ngModel)]="property.area"\r
			maxlength="64" />\r
	</div>\r
\r
	<div class="field">\r
		<label for="propertyDescription" class="label">Description</label>\r
		<textarea\r
			soho-textarea\r
			type="text"\r
			maxlength="256"\r
			name="propertyDescription"\r
			id="propertyDescription"\r
			[(ngModel)]="property.description"></textarea>\r
	</div>\r
\r
	<div class="field">\r
		<label for="propertyValue" class="label required">Value</label>\r
		<textarea\r
			soho-textarea\r
			type="text"\r
			maxlength="256"\r
			name="propertyValue"\r
			id="propertyValue"\r
			[(ngModel)]="property.propertyValue"\r
			data-validate="required"\r
			required></textarea>\r
	</div>\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal"\r
			(click)="close()"\r
			[disabled]="isBusy"\r
			id="lm-a-prop-edit-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			class="btn-modal-primary"\r
			(click)="onOk()"\r
			[disabled]="isBusy"\r
			id="lm-a-prop-edit-dialog-ok">\r
			{{ addEditBtnLabel }}\r
		</button>\r
	</div>\r
</div>\r
`;var Zo,xi=(Zo=class extends J{constructor(e,t,i){super("AddEditPropertyComponent",e),this.adminService=t,this.adminContext=i,this.items=[]}ngOnInit(){let e=v.copy(this.parameter);this.property=e.property,this.isEdit=e.isEdit,this.addEditBtnLabel=this.isEdit?"Save":"Add",this.invalidNames=["productname","version","logicalid","hostname","context","port","usehttps","tenantid"],this.maskOptions={definitions:{i:/[a-z0-9\.\_]/},pattern:"iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"},this.initModalDialog()}onOk(){this.isNameValid()?(this.setCanClose(!1),this.isEdit?this.updateProperty():this.addProperty()):this.showInvalidDialog()}isNameValid(){return!u.contains(this.invalidNames,this.property.propertyId.toLowerCase())}showInvalidDialog(){let e=[{text:"Ok",id:"lm-a-prop-invalid-message-ok",click:(t,i)=>{i.close()},isDefault:!0}];this.messageService.error().title("Invalid name").message(`The property name '${this.property.propertyId}' is not valid.`).attributes({name:"id",value:"lm-a-prop-invalid-message"}).buttons(e).open()}addProperty(){let e=this.property,t=this.adminService;if(u.itemByProperty(this.items,"propertyId",e.propertyId))this.setCanClose(!0),this.showMessage("Could not add property","A property with that name already exists");else{this.setBusy(!0);let s=this;t.createProperty(e).subscribe(a=>{a.content.changedByName=this.adminContext.get().userName,this.closeWithResult(C.Ok,a.content)},a=>{t.handleError(a,"Could not add property."),s.setBusy(!1),s.setCanClose(!0)})}}updateProperty(){let e=this.adminService,t=this.property;this.setBusy(!0),e.updateProperty(this.property).subscribe(i=>{let s=this.items,a=u.indexByProperty(s,"propertyId",t.propertyId);s[a]=t,this.closeWithResult(C.Ok,i.content)},i=>{this.setBusy(!1),this.setCanClose(!0),e.handleError(i)})}},Zo.ctorParameters=()=>[{type:b},{type:y},{type:O}],Zo);xi=d([p({template:Pd})],xi);var Dd=`\uFEFF<div\r
	#propertiesViewRef\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-button="tertiary"\r
				icon="export"\r
				[disabled]="!items.length"\r
				data-action="exportAll"\r
				id="lm-a-prop-exportall">\r
				Export All\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="import"\r
				data-action="importProperties"\r
				id="lm-a-prop-import">\r
				Import\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="tertiary"\r
				icon="add"\r
				data-action="addProperty"\r
				id="lm-a-prop-add">\r
				Add Property\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh"\r
				id="lm-a-prop-refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				icon="edit"\r
				[disabled]="selectionCount !== 1"\r
				(click)="openAddEditPropertyConnection(true)"\r
				id="lm-a-prop-edit">\r
				Edit\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="delete"\r
				(click)="showConfirmDelete()"\r
				id="lm-a-prop-delete">\r
				Delete ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				icon="export"\r
				(click)="exportProperties()"\r
				id="lm-a-prop-export">\r
				Export ({{ selectionCount }})\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		soho-datagrid\r
		id="adminPropertiesGrid"\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateGridSelection($event.rows)"></div>\r
</div>\r
`;var Xs,jo=(Xs=class extends q{constructor(e,t,i,s,a){super("AdminPropertiesComponent","property",e,t,i,s,a),this.items=[],this.selectionCount=0,this.initGrid()}ngOnInit(){this.refresh()}listItems(e){let t=this.adminService;this.setBusy(!0),t.listProperties(e).subscribe(i=>{this.propertiesGrid.clearFilter(),this.items=i.content,this.updateGridData(),this.setBusy(!1)},i=>{this.setBusy(!1),t.handleError(i)})}updateGridSelection(e){e.length!==this.selectionCount&&(this.selectionCount=e.length,this.selection=e,this.selected=e&&e.length===1?e[0].data:null)}exportProperties(){if(this.selectionCount===this.items.length)this.exportAll();else{let e=this.getSelectedItems();this.adminService.exportProperties(e)}}exportAll(){this.adminService.exportProperties()}importProperties(){let e="Import Properties",t={operation:ne.adHocProperties.toString(),title:e,acceptFileExtension:".json"};this.adminService.openImportFilesDialog(t,this.propertiesView).subscribe(i=>{let s=i.value;i.button===C.Yes&&s.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,s.message).subscribe(a=>{a.button===C.Ok&&this.refresh()}):i.button===C.Yes&&s.responseCode===Q.Fail&&this.adminService.showUploadCompleteDialog(e,s.message,!0)})}showConfirmDelete(){this.showConfirm("Remove Properties","Are you sure that you want to remove the selected properties?").subscribe(()=>{this.deleteProperties()})}deleteProperties(){if(this.isBusy)return;this.setBusy(!0);let e=this.getSelectedItems(),t=[];for(let i of e)t.push(this.adminService.deleteProperty(i.propertyId));Kn(t).pipe(an(),or()).subscribe(()=>{this.clearSelection(),this.setBusy(!1),this.refresh()},i=>{this.onDeleteError(i,e.length>1)})}addProperty(){this.openAddEditPropertyConnection(!1)}openAddEditPropertyConnection(e){let t=this.sohoDialogService.modal(xi,this.propertiesView).title(e?"Edit Property":"Add Property").id("lm-a-prop-edit-dialog").afterClose(i=>{i&&i.value&&this.refresh()});t.apply(i=>{i.modalDialog=t,i.parameter=e?{isEdit:!0,property:this.getSelectedItems()[0]}:{isEdit:!1,property:{propertyId:"",propertyValue:""}},i.items=this.items}).open()}getDataGrid(){return this.propertiesGrid}getEmptyMessage(){return"No properties found"}getColumns(){return[this.getSelectionColumn(),{width:235,id:"adm-p-col-pid",field:"propertyId",name:"Name",resizable:!0,sortable:!0,filterType:"text",formatter:S.text},{width:200,id:"adm-p-col-desc",field:"description",name:"Description",resizable:!0,sortable:!0,filterType:"text",formatter:S.text},{width:200,id:"adm-p-col-pv",field:"propertyValue",name:"Value",resizable:!0,sortable:!0,filterType:"text",formatter:S.text},{width:200,id:"adm-p-col-cd",field:"changeDate",name:"Change date",resizable:!0,sortable:!0,filterType:"text",formatter:S.date},{width:180,id:"adm-p-col-cbn",field:"changedByName",name:"Changed by",resizable:!0,sortable:!0,filterType:"text",formatter:S.displayName},{width:180,id:"adm-p-col-area",field:"area",name:"Area",resizable:!0,sortable:!0,filterType:"text",formatter:S.text}]}initGrid(){let e=this.defaultOptions();e.filterable=!0,this.datagridOptions=e}onDeleteError(e,t){let i="Unable to delete "+(t?"all of the selected properties.":"the selected property.");this.adminService.handleError(e,i),this.setBusy(!1),t&&(this.clearSelection(),this.refresh())}},Xs.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B}],Xs.propDecorators={propertiesView:[{type:f,args:["propertiesViewRef",{read:A,static:!1}]}],propertiesGrid:[{type:f,args:[Ai,{static:!1}]}]},Xs);jo=d([p({selector:"lm-admin-properties",template:Dd})],jo);var Ed=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true"></soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" for="admin-tags-searchfield">Search</label>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="32"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="admin-tags-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				menu="lmAdminTagsSort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lmAdminTagsSort">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of orderByItems"\r
					(click)="setOrderBy(item)">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-tags-sortorder'"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				id="lm-a-tags-filter"\r
				menu="lmAdminTagsFilter"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[content]="filterTooltipFunc">\r
				<svg soho-icon *ngIf="filter.type > 0" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popumenu id="lmAdminTagsFilter" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					(click)="onFilter(item, viewRef, $event); setFilterTooltip()"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-tags-filteroption'"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator" *ngIf="!isReadOnly"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tags-add"\r
				icon="add"\r
				data-action="add"\r
				*ngIf="!isReadOnly">\r
				Add Tags\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-tags-refresh"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tags-delete"\r
				icon="delete"\r
				(click)="onClickDelete()"\r
				*ngIf="!isReadOnly">\r
				Delete ({{ selectionCount }})\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#tagsDatagrid\r
		id="gridTags"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-tags-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a\r
					soho-hyperlink\r
					id="lm-a-tags-clear-filters"\r
					(click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Td=`\uFEFF<div\r
	soho-busyindicator\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	[activated]="isBusy">\r
	<div class="field">\r
		<label>Content type</label>\r
	</div>\r
	<fieldset class="radio-group">\r
		<input\r
			type="radio"\r
			[disabled]="hasTags()"\r
			id="tags-add-both"\r
			class="radio"\r
			[(ngModel)]="selectedType"\r
			[value]="0" />\r
		<label for="tags-add-both" class="radio-label"\r
			>Both pages and widgets</label\r
		>\r
		<br />\r
		<input\r
			type="radio"\r
			[disabled]="hasTags()"\r
			id="tags-add-pages"\r
			class="radio"\r
			[(ngModel)]="selectedType"\r
			[value]="1" />\r
		<label for="tags-add-pages" class="radio-label">Only pages</label>\r
		<br />\r
		<input\r
			type="radio"\r
			[disabled]="hasTags()"\r
			id="tags-add-widgets"\r
			class="radio"\r
			[(ngModel)]="selectedType"\r
			[value]="2" />\r
		<label for="tags-add-widgets" class="radio-label">Only widgets</label>\r
	</fieldset>\r
	<lm-tags-customize-component\r
		[tags]="tags"\r
		[maxNr]="20"\r
		[isAuto]="false"></lm-tags-customize-component>\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal"\r
			(click)="onCancel()"\r
			[disabled]="isBusy"\r
			id="lm-a-tagsadd-dialog-cancel">\r
			Cancel\r
		</button>\r
		<button\r
			class="btn-modal-primary"\r
			(click)="onOk()"\r
			[disabled]="!hasTags() || isBusy"\r
			id="lm-a-tagsadd-dialog-cancel">\r
			OK\r
		</button>\r
	</div>\r
</div>\r
`;var ea,Yo=(ea=class extends q{constructor(e,t,i,s,a,o,n){super("AdminTagsComponent","tag",e,t,s,a,i,{sortUsedBy:!1,isFilter:!0,isUserFilter:!1,isRestrictionFilter:!1,filters:[{name:"Pages",type:H.PageTags},{name:"Widgets",type:H.WidgetTags}]}),this.adminService=s,this.sohoModalDialogService=a,this.viewRef=o,this.adminContext=n,this.includeAll=!1,this.initGrid()}ngOnInit(){this.initializing&&(this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.isReadOnly=E.isReadOnlyUser(e)}),this.refresh())}getDataGrid(){return this.dataGrid}setFilterTooltip(){function e(){return"Filter active"}function t(){return!1}this.filter.type>0?this.filterTooltipFunc=e:this.filterTooltipFunc=t}listItems(e){if(this.isBusy)return;let t=this,i=t.adminService;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let s=H,a=this.filter,o=a?a.type:0,n=o===s.PageTags?1:o===s.WidgetTags?2:0,r=this.orderBy,l={paging:this.paging,pageSize:this.pageSize,sortOrder:r.order,sortBy:r.entity,query:this.query,tagType:n};this.setRequestFilters(l),i.listTags(l).subscribe(c=>{t.addItems(c.content,c.paging),t.setBusy(!1)},c=>{t.setBusy(!1),t.onError(c)})}add(){let e=this,t=this.sohoModalDialogService.modal(Ks,this.viewRef).title("Add Tags").id("lm-admin-tags-mdl").afterClose(i=>{i&&i.button===C.Ok&&e.refresh()});t.apply(i=>{i.modalDialog=t}).open()}onClickDelete(){if(!this.hasSelection())return;let e=this.sohoModalDialogService.message("<p>Are you sure that you want to delete the selected tags? The tags will only be deleted from the suggestion list. They will not be deleted from the widgets/pages that already use the tags.</p>").buttons([{text:"No",id:"lm-a-tags-delete-message-no",click:()=>{e.close(C.No)}},{text:"Yes",id:"lm-a-tags-delete-message-yes",click:()=>{e.close(C.Yes)},isDefault:!0}]).title("Confirmation").id("lm-admin-tags-mdl").open().afterClose(t=>{t===C.Yes&&this.deleteTags()})}getColumns(){let e=this;return[this.getSelectionColumn(),{width:"100%",id:"adm-tg-col-tg",field:"tag",name:"Tag",sortable:!1},{width:200,id:"adm-tg-col-tgt",field:"tagType",name:"Content Type",sortable:!1,formatter:(t,i,s,a)=>{let o=e.items[t].tagType;return o===1?"Page":o===2?"Widget":""}},{width:250,id:"adm-tg-col-cd",field:"changeDate",name:"Change date",sortable:!1,formatter:S.date}]}getEmptyMessage(){return"No tags found"}deleteTags(){let e=this,t=e.getSelectedItems();e.setBusy(!0),e.adminService.deleteTags({content:t}).subscribe(i=>{e.setBusy(!1),e.refresh()},i=>{e.setBusy(!1),e.onError(i)})}initGrid(){let e=this.defaultOptions();e.expandableRow=!1,this.datagridOptions=e}},ea.ctorParameters=()=>[{type:b},{type:L},{type:B},{type:y},{type:w},{type:A},{type:O}],ea.propDecorators={dataGrid:[{type:f,args:["tagsDatagrid",{static:!1}]}]},ea);Yo=d([p({selector:"lm-admin-tags",template:Ed})],Yo);var $o,Ks=($o=class{constructor(e){this.adminService=e,this.tags=[],this.selectedType=0,this.enableType=!0,this.isBusy=!1,this.canClose=!0}ngOnInit(){this.modalDialog.beforeClose(()=>this.canClose)}hasTags(){return this.tags.length>0}onCancel(){this.modalDialog.close({button:C.Cancel})}onOk(){let e=this.tags;if(e.length===0)return;let t=a=>e.map((o,n)=>({tag:o,tagType:a})),i=this.selectedType,s;if(i===0){let a=t(1),o=t(2);s=a.concat(o)}else s=t(i);this.addTags(s)}addTags(e){if(!e||e.length===0)return;this.setBusy(!0),this.canClose=!1;let t=this;this.adminService.updateTags({content:e}).subscribe(i=>{t.setBusy(!1),t.canClose=!0,this.modalDialog.close({button:C.Ok})},i=>{t.setBusy(!1),t.adminService.handleError(i)})}setBusy(e){this.isBusy!==e&&(this.isBusy=e)}},$o.ctorParameters=()=>[{type:y}],$o);Ks=d([p({selector:"lm-admin-add-tags-component",template:Td})],Ks);var Bn=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<div\r
		*ngIf="angularJsWarning"\r
		style="display: flex; margin-bottom: 10px"\r
		class="lm-info-text-md">\r
		<svg soho-icon icon="alert" [alert]="true" style="min-width: 30px"></svg>\r
		<span style="margin: 10px 0 0 5px">{{ angularJsWarning }}</span>\r
	</div>\r
\r
	<lm-admin-message-banner\r
		*ngIf="messageBanner"\r
		[options]="messageBanner"\r
		style="display: flex; margin-bottom: 10px"></lm-admin-message-banner>\r
\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section [isTitle]="true"></soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" [for]="idSearch">Search</label>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				[id]="idSearch"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				id="lm-a-sw-sort-button"\r
				[menu]="idSort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu [id]="idSort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-sw-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				*ngIf="showFilter"\r
				id="lm-a-sw-filter-button"\r
				menu="lmAdminStandardWidgetsFilter"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="showFilter && filter.type > 0 ? 'Filter active' : null">\r
				<svg\r
					soho-icon\r
					*ngIf="showFilter && filter.type > 0"\r
					icon="info"\r
					[alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul\r
				soho-popupmenu\r
				*ngIf="showFilter"\r
				id="lmAdminStandardWidgetsFilter"\r
				class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-sw-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator" *ngIf="showImport"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-sw-import"\r
				icon="import"\r
				*ngIf="showImport"\r
				data-action="import">\r
				Import\r
			</button>\r
			<div class="separator" *ngIf="showShow"></div>\r
			<button\r
				soho-menu-button\r
				id="lm-admin-sw-show"\r
				*ngIf="showShow"\r
				menu="lmAdminStandardWidgetsShow"\r
				type="button">\r
				Show\r
			</button>\r
			<ul\r
				soho-popupmenu\r
				id="lmAdminStandardWidgetsShow"\r
				*ngIf="showShow"\r
				class="is-selectable">\r
				<li soho-popupmenu-item [isChecked]="!includeAll">\r
					<a\r
						soho-popupmenu-label\r
						id="lm-a-sw-show-active"\r
						(click)="showAll(false)"\r
						>Show Active</a\r
					>\r
				</li>\r
				<li soho-popupmenu-item [isChecked]="includeAll">\r
					<a soho-popupmenu-label id="lm-a-sw-show-all" (click)="showAll(true)"\r
						>Show All</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-sw-refresh"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div>\r
		<ul soho-popupmenu id="{{ idPermissions }}">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-sw-edit-permissions"\r
					(click)="editAccess()"\r
					>Edit Permissions</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1 || !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-sw-copy-permissions"\r
					(click)="copyAccess()"\r
					>Copy Permissions</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-sw-apply-permissions"\r
					(click)="applyAccessCopy()"\r
					>Apply Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-sw-replace-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(true)"\r
					>Replace Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount === 1 && !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-sw-clear-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(false)"\r
					>Clear Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<ng-container *ngFor="let action of actions">\r
				<button\r
					soho-button="tertiary"\r
					*ngIf="!action.separator && (!action.visible || action.visible())"\r
					icon="{{ action.icon }}"\r
					[disabled]="action.enabled && !action.enabled()"\r
					(click)="action.click()"\r
					[name]="action.text | lmAutoId: 'lm-a-sw-action'">\r
					{{ action.text ? action.text() : "" }}\r
				</button>\r
				<div *ngIf="action.separator" class="separator"></div>\r
			</ng-container>\r
\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="{{ idPermissions }}"\r
				type="button"\r
				id="lm-admin-sw-permissions">\r
				<span>Permissions</span>\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#standardWidgetsDatagrid\r
		id="gridStandardWidgets"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-sw-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || (showFilter && filter.type)"\r
				>There are active filters.\r
				<a soho-hyperlink id="lm-a-sw-clear-filters" (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var kd=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0"\r
	class="lm-a-sw-det-dlg">\r
	<div soho-tabs>\r
		<div soho-tab-list-container>\r
			<ul soho-tab-list>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-sw-det-tab-det">Details</a>\r
				</li>\r
				<li soho-tab>\r
					<a soho-tab-title tabId="lm-a-sw-det-tab-adv">Advanced</a>\r
				</li>\r
			</ul>\r
		</div>\r
	</div>\r
\r
	<div soho-tab-panel-container>\r
		<div soho-tab-panel tabId="lm-a-sw-det-tab-det">\r
			<div class="six columns">\r
				<div class="field">\r
					<label for="lm-a-sw-det-wid">Widget ID</label>\r
					<p id="lm-a-sw-det-wid">{{ definition?.widgetId }}</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-ttl">Widget title</label>\r
					<p id="lm-a-sw-det-ttl">{{ definition?.title }}</p>\r
				</div>\r
			</div>\r
			<div *ngIf="deployInfo" class="six columns">\r
				<div class="field">\r
					<label for="lm-a-sw-det-cv">Current Homepages version</label>\r
					<p id="lm-a-sw-det-cv">{{ deployInfo.currentVersion }}</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-av"\r
						>Homepages version when synchronized</label\r
					>\r
					<p id="lm-a-sw-det-av">{{ deployInfo.applicationVersion }}</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-sync">Synchronization date</label>\r
					<p id="lm-a-sw-det-sync">{{ deployInfo.syncDate | lmLocaleDate }}</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-rs">Infor Registry modified date</label>\r
					<p id="lm-a-sw-det-rs">\r
						{{ deployInfo.registryUpdateDate | lmLocaleDate }}\r
					</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-sv">Schema version</label>\r
					<p id="lm-a-sw-det-sv">{{ deployInfo.schemaVersion }}</p>\r
				</div>\r
			</div>\r
			<div *ngIf="tenantInfo" class="six columns">\r
				<div class="field">\r
					<label for="lm-a-sw-det-ath">Author</label>\r
					<p id="lm-a-sw-det-ath">{{ definition.author }}</p>\r
				</div>\r
				<div class="field">\r
					<label for="lm-a-sw-det-sgb">Signed by Infor</label>\r
					<p id="lm-a-sw-det-sgb">{{ tenantInfo.signed }}</p>\r
				</div>\r
				<div class="field" *ngIf="tenantInfo.signTimestamp">\r
					<label for="lm-a-sw-det-sgt">Sign timestamp</label>\r
					<p id="lm-a-sw-det-sgt">\r
						{{ tenantInfo.signTimestamp | lmLocaleDate }}\r
					</p>\r
				</div>\r
			</div>\r
		</div>\r
		<div soho-tab-panel tabId="lm-a-sw-det-tab-adv">\r
			<pre>{{ definition | json }}</pre>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			type="button"\r
			class="btn-modal-primary"\r
			(click)="close()"\r
			id="lm-a-w-details-dialog-close">\r
			Close\r
		</button>\r
	</div>\r
</div>\r
`;var Od=`.lm-a-sw-det-dlg{max-width:800px!important;min-width:800px!important;width:800px!important}.lm-a-sw-det-dlg pre{font-size:12px}
/*# sourceMappingURL=widget-details-dialog.css.map */
`;var Ho,Dt=(Ho=class extends R{constructor(e,t){super("WidgetDetailsDialogComponent"),this.adminService=e,this.context=t}ngOnInit(){this.setBusy(!0),this.adminService.getWidgetDeployInfo({id:this.widgetId,v:this.version}).subscribe(e=>{this.onResponse(e),this.setBusy(!1)},e=>{this.setBusy(!1),this.adminService.handleError(e)})}setBusy(e){this.isBusy=e}close(){this.dialog.close()}onResponse(e){let t=e.content,i=t.definition;this.definition=i,i.isTenant?this.tenantInfo=this.createTenantInfo(i):t.deployInfo&&(this.deployInfo=this.createDeployInfo(t.deployInfo)),delete i.cacheArg,delete i.description}createDeployInfo(e){let t={};try{let i=e.split(";");t.schemaVersion=i[0],t.registryUpdateDate=this.toDate(i[1]),t.syncDate=this.toDate(i[2]),t.applicationVersion=i[3],t.currentVersion=this.context.get().version}catch(i){this.logError("createDeployInfo",i)}return t}toDate(e){return e?new Date(parseInt(e,10)):null}createTenantInfo(e){let t=e.signed,i="No";return t===1?i="Yes":e.signed===2&&(i="Yes (expired certificate)"),{signed:i,signTimestamp:e.signTimestamp}}},Ho.ctorParameters=()=>[{type:y},{type:O}],Ho);Dt=d([p({template:kd,styles:[Od]})],Dt);var ta,qo=(ta=class extends q{constructor(e,t,i,s,a,o,n,r,l,c){super(e,"widget",t,i,s,a,o,c),this.adminContext=n,this.widgetService=r,this.viewRef=l,this.actions=[],this.idSort="lmAdminStandardWidgetsSort",this.idShow="lmAdminStandardWidgetsShow",this.idShowButton="lm-admin-sw-show",this.idPermissions="lmAdminStandardWidgetPermissions",this.idSearch="admin-standard-widgets-searchfield",this.enablePortation=!0,this.enableShow=!0,this.showFilter=!1,this.showShow=!1,this.showImport=!1,this.showExport=!1,this.includeAll=!1,this.showFilter=c&&c.isFilter,this.datagridOptions=this.defaultOptions()}ngOnInit(){this.initializing&&this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.isCloud=e.isCloud,this.validateAngularJS(e)}),this.calculateVisibility(),this.actions=this.getActions(),this.refresh()}getDataGrid(){return this.dataGrid}listItems(e){if(this.isBusy)return;let t=this,i=t.adminService;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let s=this.orderBy,a={paging:this.paging,pageSize:this.pageSize,sortOrder:s.order,sortBy:s.entity,query:this.query};this.setRequestFilters(a),this.includeAll&&(a.includeAll=!0),i.listStandardWidgets(a).subscribe(o=>{let n=o.content;t.addItems(n,o.paging),t.updateCount(o.count,this.maxCount),t.setBusy(!1)},o=>{t.setBusy(!1),t.onError(o)})}editAccess(){let e=this.getSelectedItem();this.adminService.openWidgetAccessDialog(e,t=>{t&&t.content?this.refresh():this.onError(t)},this.viewRef)}copyAccess(){let e=this.getSelectedItem(),t=this,i=t.adminService;this.setBusy(!0),i.getWidgetAccess({id:e.widgetId,accessList:[]}).subscribe(s=>{t.accessCopy=Mt.getAccessCopy(s.content.accessList),t.accessCopyWidgetId=e.widgetId,t.setBusy(!1)},s=>{t.adminService.handleError(s),t.setBusy(!1)})}applyAccessCopy(){let e=this.getSelectedItems();this.adminService.applyWidgetAccess(e,this.accessCopy,()=>{this.refresh()})}clearOrReplaceWithAccessCopy(e){let t=this.getSelectedItems();this.adminService.clearOrReplaceWidgetAccess(t,e,()=>{this.refresh()},this.accessCopy)}import(){if(!this.enablePortation)return;let e="Install Standard Widgets",t=this.adminService,i={title:e,operation:ne.standardWidget.toString()},s=this;t.openImportFilesDialog(i,this.viewRef).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,o.message).subscribe(n=>{n.button===C.Ok&&s.refresh()}):a.button===C.Yes&&o.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,o.message,!0)})}onClickDelete(){let e=this.getSelectedItems();if(!e){this.logWarning("No selection to delete");return}if(e.length===0){this.logWarning("No selection to delete");return}let t=e.map(n=>({widgetId:n.widgetId,version:n.version})),i=e.length>1,s=e[0],a=i?"Delete Widgets":"Delete Widget",o=i?"Are you sure that you want to remove the selected widgets? They will be removed for all users.":`Are you sure that you want to remove the widget '${s.title}'? It will be removed for all users.`;this.showConfirm(a,o).subscribe(()=>{this.deleteWidgets(t,a)})}deleteWidgets(e,t){this.setBusy(!0),this.widgetService.deleteStandard(e).subscribe(i=>{let s="",a=i.messageList;if(a)for(let o of a)s+=o.message;this.adminService.showUploadCompleteDialog(t,s).subscribe(o=>{o.button===C.Ok&&i.content&&i.content>0&&this.refresh()}),this.setBusy(!1)},i=>{this.setBusy(!1),this.adminService.handleError(i,i.getErrorMessages())})}showAll(e){let t=this.includeAll;e!==t&&(this.includeAll=e,this.query&&(this.isSearchActive=!0),this.refresh())}onExpandRow(e){let t=$(e.detail).find(".datagrid-row-detail-padding").empty(),i=e.item,s=null,a=this.escape(i.description);if(i.earlyInfo?s=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${a}<p class="lm-margin-md-t">${this.escape(i.earlyInfo)}</p></span>
			`:s=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${a}</span>
			`,i.widgetErrorInfo&&(s+=this.getErrorMessageTemplate(fe.formatError(i.widgetErrorInfo.message))),i.isDeprecated){let o=i.deprecatedInfo?i.deprecatedInfo:"This widget has been deprecated and will soon be removed.";s+=this.getErrorMessageTemplate(fe.formatAlert(this.escape(o)))}i.helpUrl&&!this.hasReplacementTemplate(i.helpUrl)&&(s+=this.getLinkTemplate(i.helpUrl)),s+="</div>",$(t).append($(s))}onClickExport(){if(!this.enablePortation)return;let e=this.getSelectedItems();if(!e){this.logWarning("No selection to export");return}if(e.length!==1){this.logWarning("Invalid selection to export. Multiselect not supported");return}let t=e[0],i="Export widget",s=`Are you sure that you want to export ${t.title}?`;this.showConfirm(i,s).subscribe(()=>{this.adminService.exportStandardWidget(t)})}onClickViewDetails(){if(this.isDetailsOpen)return;this.isDetailsOpen=!0;let e=this.getSelectedItem(),t=this.sohoDialogService.modal(Dt,this.viewRef).title("Widget Details").id("lm-a-sw-details-dialog").afterClose(()=>{this.isDetailsOpen=!1});t.apply(i=>{i.dialog=t,i.widgetId=e.widgetId,i.version=e.version}).open()}getActions(){let e=[];return this.showExport&&e.push({text:()=>"Export ("+this.selectionCount+")",icon:"export",enabled:()=>this.selectionCount===1,click:()=>this.onClickExport()}),this.isCloud||(e.push({text:()=>"Delete ("+this.selectionCount+")",icon:"delete",enabled:()=>this.selectionCount===1,click:()=>this.onClickDelete()}),e.push({separator:!0})),e.push({text:()=>"View Details",icon:"info-linear",enabled:()=>this.selectionCount===1,click:()=>this.onClickViewDetails()}),e}calculateVisibility(){this.showShow=this.enableShow&&!this.isCloud,this.showImport=this.enablePortation&&!this.isCloud,this.showExport=this.showImport}validateAngularJS(e){let t=e.angularJsWidgetCount;t>0&&(this.angularJsWarning="You have "+t+" AngularJS "+E.pluralize("widget",t)+" installed. AngularJS widgets are no longer supported and must be migrated to Angular or jQuery implementations.")}getColumns(){let e=this;return[this.getSelectionColumn(),{width:345,id:"adm-sw-col-t",field:"title",name:"Title",sortable:!1,formatter:Formatters.Expander},{width:250,id:"adm-sw-col-wi",field:"widgetId",name:"Widget ID",sortable:!1,formatter:(t,i,s)=>{let a=e.items[t];return a.widgetErrorInfo?fe.formatError(s):a.isDeprecated?fe.formatAlert(s):s}},{width:160,id:"adm-sw-col-cd",field:"changeDate",name:"Change date",sortable:!1,formatter:S.date},{width:150,id:"adm-sw-col-s",field:"source",name:"Source",sortable:!1,formatter:(t,i,s)=>kr.map[s]+" ("+(e.items[t].displayVersion||e.items[t].version)+")"},{width:150,id:"adm-sw-col-cbn",field:"changedByName",name:"Changed by",sortable:!1,formatter:S.displayName},{width:140,id:"adm-sw-col-hr",field:"hasRestrictions",name:"Permissions",sortable:!1,formatter:S.restricted}]}getEmptyMessage(){return"No standard widgets found"}},ta.ctorParameters=()=>[{type:String},{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:at},{type:A},{type:void 0}],ta.propDecorators={dataGrid:[{type:f,args:["standardWidgetsDatagrid",{static:!1}]}],searchField:[{type:f,args:[Pi,{static:!1}]}]},ta);qo=d([Ue()],qo);var Jo,Qo=(Jo=class extends qo{constructor(e,t,i,s,a,o,n,r){super("AdminStandardWidgetsComponent",e,t,i,s,a,o,n,r,{isFilter:!0,isUserFilter:!1,filters:[{name:"Mobile",propertyName:"includeMobileOnly",value:!0,type:H.Custom}]})}},Jo.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:at},{type:A}],Jo);Qo=d([p({selector:"lm-admin-standard-widgets",template:Bn})],Qo);var Ko,Xo=(Ko=class extends qo{constructor(e,t,i,s,a,o,n,r){super("EarlyAccessWidgetsComponent",e,t,i,s,a,o,n,r,{isFilter:!1,isUserFilter:!1}),this.idSort="lm-a-eaw-sort",this.idFilter="lm-a-eaw-filter",this.idPermissions="lm-a-eaw-perm",this.idSearch="lm-a-eaw-search",this.enablePortation=!1,this.enableShow=!1,this.messageBanner={title:"Get early access to upcoming Infor Homepages widgets before they are publicly released",message:"IMPORTANT NOTICE: Early access widgets are beta software that may not be fully tested so you might experience technical difficulties. Early access widgets are not intended as a substitute for your primary widgets and Homepages content. Early access content may be different from publicly released content. Infor is not responsible for any technical difficulties or data loss that occurs through the use of early access widgets.",level:ze.Info}}setRequestFilters(e){e.includeEarlyAccessOnly=!0}getEmptyMessage(){return"No early access widgets found"}validateAngularJS(e){}getActions(){let e=super.getActions();return e.unshift({text:()=>"Disable",icon:"collapse-all",click:()=>this.onUpdate(!1),enabled:()=>this.canToggle(!1)}),e.unshift({text:()=>"Enable",icon:"expand-all",click:()=>this.onUpdate(!0),enabled:()=>this.canToggle(!0)}),e}getColumns(){let e=this,t=super.getColumns();t[1].width-=100;let i={width:100,id:"adm-eaw-col-ebl",field:"isEnabled",name:"Enabled",sortable:!1,formatter:(s,a,o)=>e.items[s].isEnabled?"Yes":"No"};return t.splice(2,0,i),t}canToggle(e){let t=this.getSelectedItems();if(t.length===0)return!1;for(let i of t)if(e&&i.isEnabled||!e&&!i.isEnabled)return!1;return!0}onUpdate(e){if(this.isBusy)return;let t={enable:e,content:this.getSelectedIds()};this.setBusy(!0),this.widgetService.updadateEarlyAccess(t).subscribe(i=>{this.setBusy(!1),this.refresh()},i=>{this.setBusy(!1),this.adminService.handleError(i,i.getErrorMessages())})}getSelectedIds(){return this.getSelectedItems().map(e=>e.widgetId)}},Ko.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:w},{type:B},{type:O},{type:at},{type:A}],Ko);Xo=d([p({selector:"lm-admin-early-access-widgets",template:Bn})],Xo);var Rd=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<soho-toolbar-flex (selected)="onSelectedToolbar($event)">\r
		<soho-toolbar-flex-section\r
			[isTitle]="true"\r
			class="lm-info-text-md"\r
			id="lm-a-pw-maxtitle">\r
			<svg\r
				soho-icon\r
				[alert]="true"\r
				icon="alert"\r
				soho-tooltip\r
				title="{{ quotaTitle }}"\r
				*ngIf="isCloseToMaxQuota"\r
				id="lm-a-pw-maxicon"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" for="admin-published-widgets-searchfield"\r
				>Search</label\r
			>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="admin-published-widgets-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				id="lm-a-pw-sort-button"\r
				menu="lmAdminPublishedWidgetsSort"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lmAdminPublishedWidgetsSort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-pw-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
\r
			<!-- Filter -->\r
			<button\r
				soho-menu-button\r
				id="lm-a-pw-filter-button"\r
				menu="lmAdminPublishedWidgetsFilter"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul\r
				soho-popupmenu\r
				id="lmAdminPublishedWidgetsFilter"\r
				class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-pw-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-pw-exportall"\r
				icon="export"\r
				[disabled]="!items.length"\r
				data-action="exportAll">\r
				Export All\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-pw-import"\r
				icon="import"\r
				data-action="importWidgets"\r
				*ngIf="!isReadOnly">\r
				Import\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-pw-refresh"\r
				icon="refresh"\r
				data-action="refresh"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				Refresh\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div>\r
		<ul soho-popupmenu id="lmAdminPublishedWidgetPermissions">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-edit-permissions"\r
					(click)="editAccess()"\r
					>Edit Permissions</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1 || !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-copy-permissions"\r
					(click)="copyAccess()"\r
					>Copy Permissions</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-apply-permissions"\r
					(click)="applyAccessCopy()"\r
					>Apply Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-replace-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(true)"\r
					>Replace Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount === 1 && !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-clear-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(false)"\r
					>Clear Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
		<ul soho-popupmenu id="lmAdminPublishedWidgetsMore">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-show-details"\r
					(click)="showDetails()"\r
					>View Details</a\r
				>\r
			</li>\r
			<li soho-popupmenu-separator *ngIf="!isReadOnly"></li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1"\r
				*ngIf="!isReadOnly">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-take-ownership"\r
					(click)="takeOwnership()"\r
					>Take Ownership</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1"\r
				*ngIf="!isReadOnly">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-pw-change-ownership"\r
					(click)="changeOwnership()"\r
					>Change Ownership</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-pw-delete"\r
				icon="delete"\r
				(click)="onClickDelete()"\r
				*ngIf="!isReadOnly">\r
				Delete ({{ selectionCount }})\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-pw-export"\r
				icon="export"\r
				(click)="exportWidgets()">\r
				Export ({{ selectionCount }})\r
			</button>\r
			<div class="separator" *ngIf="!isReadOnly"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminPublishedWidgetPermissions"\r
				type="button"\r
				id="lm-admin-pw-permissions"\r
				*ngIf="!isReadOnly">\r
				<span>Permissions</span>\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminPublishedWidgetsMore"\r
				type="button"\r
				id="lm-admin-pw-more">\r
				<span>More</span>\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#publishedWidgetsDatagrid\r
		id="gridPublishedWidgets"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-pw-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a soho-hyperlink id="lm-a-pw-clear-filters" (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Md=`\uFEFF<div>\r
	<div>\r
		<div class="field lm-margin-xl-b">\r
			<label>Title</label>\r
			<p id="lm-a-pw-about-w-title">{{ widget.title }}</p>\r
		</div>\r
		<div class="field lm-margin-xl-b">\r
			<label>Widget ID</label>\r
			<p id="lm-a-pw-about-w-id">{{ widget.widgetId }}</p>\r
		</div>\r
		<div class="field lm-margin-xl-b">\r
			<label>Owner ID</label>\r
			<p id="lm-a-pw-about-w-owner">{{ widget.owner }}</p>\r
		</div>\r
	</div>\r
\r
	<div class="modal-buttonset">\r
		<button\r
			class="btn-modal-primary"\r
			(click)="close()"\r
			id="lm-a-pw-about-close">\r
			Close\r
		</button>\r
	</div>\r
</div>\r
`;var sa,en=(sa=class extends q{constructor(e,t,i,s,a,o,n,r,l,c){super("AdminPublishedWidgetsComponent","widget",e,t,i,n,s,{isFilter:!0,filters:[{name:"Mobile",propertyName:"includeMobileOnly",value:!0,type:H.Custom}]}),this.adminContext=a,this.dialogService=o,this.widgetService=r,this.dataService=l,this.viewRef=c,this.datagridOptions=this.defaultOptions()}ngOnInit(){this.initializing&&this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.maxCount=e.maxCountWidget||0,this.currentUser=e.userId,this.isReadOnly=E.isReadOnlyUser(e)}),this.refresh()}getDataGrid(){return this.dataGrid}listItems(e){if(this.isBusy)return;let t=this,i=t.adminService;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let s=this.orderBy,a=this.getQuery(),o={paging:this.paging,pageSize:this.pageSize,sortOrder:s.order,sortBy:s.entity,query:a};this.setRequestFilters(o),v.isGuid(a)&&(o.entityId=a,o.query=null),i.listPublishedWidgets(o).subscribe(n=>{let r=n.content;t.addItems(r,n.paging),t.updateCount(n.count,this.maxCount),t.setBusy(!1)},n=>{t.setBusy(!1),t.onError(n)})}importWidgets(){let e="Import Published Widgets",t=this.adminService,i={title:e,operation:ne.publishedWidget.toString(),showStrategySelector:!0},s=this;t.openImportFilesDialog(i,this.viewRef).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,o.message).subscribe(n=>{n.button===C.Ok&&s.refresh()}):a.button===C.Yes&&o.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,o.message,!0)})}exportWidgets(){let e=this.getSelectedItems();this.adminService.exportPublishedWidgets(e),this.clearSelection()}exportAll(){this.adminService.exportPublishedWidgets()}onClickDelete(){let e=this.getSelectedItems();if(e&&e.length===0){this.logWarning("No selection to delete");return}let t=e.length>1,i=e.map(n=>this.createWidgetHandle(n)),s=e[0],a=t?"Delete Widgets":"Delete Widget",o=t?"Are you sure that you want to remove the selected widgets? They will be removed for all users.":`Are you sure that you want to remove the widget '${s.title}'? It will be removed for all users.`;this.showConfirm(a,o).subscribe(()=>{this.deleteWidgets(i)})}editAccess(){let e=this,t=e.getSelectedItem();this.adminService.openWidgetAccessDialog(t,i=>{i&&i.content&&e.refresh()},this.viewRef)}takeOwnership(){let e=this.getSelectedItem(),t=this;this.setBusy(!0),this.widgetService.updatePublishedOwner(e.widgetId,null).subscribe(()=>{this.setBusy(!1),this.refresh()},i=>{t.onError(i)})}changeOwnership(){let e=this.getSelectedItem(),t={title:e.title,currentOwnerId:e.owner,itemId:e.widgetId,isWidget:!0,callback:()=>this.refresh()};this.adminService.openChangeOwnerDialog(t,this.viewRef)}onExpandRow(e){let t=$(e.detail).find(".datagrid-row-detail-padding").empty(),i=this.escape(e.item.description),s=e.item,a=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${i}</span>
			`;if(s.tags){a+='<div class="lm-margin-lg-t"><span>';let o=s.tags.split("#");o.shift();for(let n of o)a+=`<a class="tag lm-margin-sm-r">${n}</a>`;a+="</span></div>"}if(s.widgetErrorInfo&&(a+=this.getErrorMessageTemplate(fe.formatError(s.widgetErrorInfo.message))),s.isDeprecated){let o=s.deprecatedInfo?s.deprecatedInfo:"This widget has been deprecated and will soon be removed.";a+=this.getErrorMessageTemplate(fe.formatAlert(this.escape(o)))}s.helpUrl&&!this.hasReplacementTemplate(s.helpUrl)&&(a+=this.getLinkTemplate(s.helpUrl)),a+="</div>",$(t).append($(a))}copyAccess(){let e=this.getSelectedItem(),t=this,i=e.widgetId,s=t.adminService;this.setBusy(!0),s.getWidgetAccess({id:i,accessList:[]}).subscribe(a=>{t.accessCopy=Mt.getAccessCopy(a.content.accessList),t.accessCopyWidgetId=i,t.setBusy(!1)},a=>{t.adminService.handleError(a),t.setBusy(!1)})}applyAccessCopy(){let e=this.getSelectedItems();this.adminService.applyWidgetAccess(e,this.accessCopy,()=>{this.refresh()})}clearOrReplaceWithAccessCopy(e){let t=this.getSelectedItems();this.adminService.clearOrReplaceWidgetAccess(t,e,()=>{this.refresh()},this.accessCopy)}showDetails(){let e=this.getSelectedItem(),t=this.sohoDialogService.modal(ia,this.viewRef).title("Details").id("lm-a-pw-details-dialog");t.apply(i=>{i.dialog=t,i.parameter={widget:e,widgetUrl:this.getWidgetUrl(e)}}).open()}getColumns(){return[this.getSelectionColumn(),{width:375,id:"adm-pw-col-t",field:"title",name:"Title",resizable:!0,sortable:!1,formatter:Formatters.Expander},{width:150,id:"adm-pw-col-on",field:"ownerName",name:"Owner",resizable:!0,sortable:!1,formatter:S.displayName},{width:250,id:"adm-pw-col-swi",field:"standardWidgetId",name:"Based on",sortable:!1,formatter:(e,t,i,s)=>{let a=this.items[e];return a.widgetErrorInfo?fe.formatError(i):a.isDeprecated?fe.formatAlert(i):i}},{width:160,id:"adm-pw-col-cd",field:"changeDate",name:"Change date",resizable:!0,sortable:!1,formatter:S.date},{width:150,id:"adm-pw-col-cbn",field:"changedByName",name:"Changed by",resizable:!0,sortable:!1,formatter:S.displayName},{width:110,id:"adm-pw-col-hr",field:"hasRestrictions",name:"Permissions",sortable:!1,formatter:S.restricted}]}getEmptyMessage(){return"No published widgets found"}createWidgetHandle(e){let t={id:e.widgetId};return ue.isNullOrWhitespace(e.standardWidgetId)||(t.pid=e.standardWidgetId,t.byRef=!0),t}deleteWidgets(e){this.setBusy(!0),this.adminService.deletePublishedWidget(e).subscribe(t=>{this.setBusy(!1),t.content>0&&this.refresh()},t=>{this.setBusy(!1),this.adminService.handleError(t,t.getErrorMessages())})}updateOwner(e,t){e.owner=t.owner,e.ownerName=t.ownerName,e.changedByName=t.changedByName,e.changeDate=t.changeDate,this.clearSelection()}getWidgetUrl(e){return window.location.protocol+"//"+window.location.host+(Pr.isLocalhost?"":"/lime")+"/?widgetid="+e.widgetId}},sa.ctorParameters=()=>[{type:b},{type:L},{type:y},{type:B},{type:O},{type:$e},{type:w},{type:at},{type:St},{type:A}],sa.propDecorators={dataGrid:[{type:f,args:["publishedWidgetsDatagrid",{static:!1}]}]},sa);en=d([p({selector:"lm-admin-published-widgets",template:Rd})],en);var ia=class{constructor(){this.widget={title:"",widgetId:"",owner:""}}ngOnInit(){let e=this.parameter.widget;e&&(this.widget.title=e.title,this.widget.widgetId=e.widgetId,this.widget.owner=e.owner)}close(){this.dialog.close()}};ia=d([p({template:Md})],ia);var Ld=`\uFEFF<div\r
	soho-busyindicator\r
	[activated]="isBusy"\r
	[blockUI]="true"\r
	[displayDelay]="0">\r
	<lm-admin-message-banner\r
		*ngIf="messageBanner"\r
		[options]="messageBanner"></lm-admin-message-banner>\r
	<soho-toolbar-flex>\r
		<soho-toolbar-flex-section [isTitle]="true" class="lm-info-text-md">\r
			<svg\r
				soho-icon\r
				icon="alert"\r
				[alert]="true"\r
				soho-tooltip\r
				[title]="quotaTitle"\r
				*ngIf="isCloseToMaxQuota"></svg>\r
			{{ toolbarTitle }}\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isSearch]="true">\r
			<label class="audible" for="admin-tenant-widgets-searchfield"\r
				>Search</label\r
			>\r
			<input\r
				soho-toolbar-flex-searchfield\r
				[clearable]="true"\r
				[collapsible]="true"\r
				maxlength="64"\r
				[(ngModel)]="query"\r
				[disabled]="toolbarDisabled"\r
				(cleared)="clearSearch()"\r
				(lm-submit)="search()"\r
				(keydown.esc)="clearSearch()"\r
				id="admin-tenant-widgets-searchfield"\r
				(focus)="onSearchfieldFocus()"\r
				(blur)="onSearchfieldFocusLost()" />\r
		</soho-toolbar-flex-section>\r
		<soho-toolbar-flex-section [isButtonSet]="true">\r
			<button\r
				soho-menu-button\r
				id="lm-a-tw-sort-button"\r
				menu="lm-a-tw-sort"\r
				[disabled]="toolbarDisabled"\r
				class="btn-menu"\r
				type="button"\r
				icon="sort-down">\r
				{{ orderBy.name }}\r
			</button>\r
			<ul soho-popupmenu id="lm-a-tw-sort">\r
				<li soho-popupmenu-item *ngFor="let item of orderByItems">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-tw-sortorder'"\r
						(click)="setOrderBy(item)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<button\r
				soho-menu-button\r
				id="lm-a-tw-a-filter-button"\r
				menu="lm-a-tw-filter"\r
				[disabled]="toolbarDisabled"\r
				type="button"\r
				icon="filter"\r
				soho-tooltip\r
				[title]="filterTooltip">\r
				<svg soho-icon *ngIf="isFiltered" icon="info" [alert]="true"></svg>\r
				Filter\r
			</button>\r
			<ul soho-popupmenu id="lm-a-tw-filter" class="is-selectable">\r
				<li\r
					soho-popupmenu-item\r
					*ngFor="let item of filterItems"\r
					[isChecked]="item.selected">\r
					<a\r
						soho-popupmenu-label\r
						[name]="item.name | lmAutoId: 'lm-a-tw-filteroption'"\r
						(click)="onFilter(item, viewRef, $event)"\r
						>{{ item.name }}</a\r
					>\r
				</li>\r
			</ul>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tw-import"\r
				icon="import"\r
				(click)="install()">\r
				Import\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-button="icon"\r
				id="lm-a-tw-refresh"\r
				icon="refresh"\r
				(click)="refresh()"\r
				style="border: 0; margin-bottom: 0"\r
				soho-tooltip\r
				title="Refresh">\r
				<span class="audible">Refresh</span>\r
			</button>\r
		</soho-toolbar-flex-section>\r
\r
		<soho-toolbar-flex-more-button> </soho-toolbar-flex-more-button>\r
	</soho-toolbar-flex>\r
\r
	<div>\r
		<ul soho-popupmenu id="lmAdminTenantWidgetPermissions">\r
			<li soho-popupmenu-item [isDisabled]="selectionCount !== 1">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-tw-edit-permissions"\r
					(click)="editAccess()"\r
					>Edit Permissions</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount !== 1 || !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-tw-copy-permissions"\r
					(click)="copyAccess()"\r
					>Copy Permissions</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-tw-apply-permissions"\r
					(click)="applyAccessCopy()"\r
					>Apply Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li soho-popupmenu-item [isDisabled]="!accessCopy">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-tw-replace-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(true)"\r
					>Replace Copied Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
			<li\r
				soho-popupmenu-item\r
				[isDisabled]="selectionCount === 1 && !selected.hasAccess">\r
				<a\r
					soho-popupmenu-label\r
					id="lm-a-tw-clear-permissions"\r
					(click)="clearOrReplaceWithAccessCopy(false)"\r
					>Clear Permissions ({{ selectionCount }})</a\r
				>\r
			</li>\r
		</ul>\r
	</div>\r
	<div class="contextual-toolbar toolbar is-hidden">\r
		<div class="title">Actions</div>\r
		<div class="buttonset">\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tw-view-details"\r
				icon="info-linear"\r
				[disabled]="selectionCount !== 1"\r
				(click)="onClickViewDetails()">\r
				View Details\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tw-export"\r
				icon="export"\r
				[disabled]="selectionCount !== 1"\r
				(click)="onClickExport()">\r
				Export\r
			</button>\r
			<button\r
				soho-button="tertiary"\r
				id="lm-a-tw-delete"\r
				icon="delete"\r
				[disabled]="selectionCount !== 1"\r
				(click)="onClickDelete()">\r
				Delete\r
			</button>\r
			<div class="separator"></div>\r
			<button\r
				soho-menu-button\r
				menu="lmAdminTenantWidgetPermissions"\r
				type="button"\r
				id="lm-admin-tw-permissions">\r
				<span>Permissions</span>\r
			</button>\r
		</div>\r
	</div>\r
	<div\r
		#tenantWidgetsDatagrid\r
		id="gridTenantWidgets"\r
		soho-datagrid\r
		[gridOptions]="datagridOptions"\r
		[data]="datagridOptions.dataset"\r
		(expandrow)="onExpandRow($event)"\r
		(selected)="updateSelection($event.rows)"></div>\r
\r
	<div class="lm-admin-quota-message lm-margin-md-t">\r
		<p *ngIf="!toolbarDisabled" id="lm-a-tw-showcounttext">\r
			{{ getItemCountText() }}\r
			<span *ngIf="isSearchActive || filter.type"\r
				>There are active filters.\r
				<a soho-hyperlink id="lm-a-tw-clear-filters" (click)="clearAllFilters()"\r
					>Clear all</a\r
				>\r
			</span>\r
		</p>\r
	</div>\r
\r
	<button\r
		id="lm-a-more-btn"\r
		soho-button\r
		type="button"\r
		(click)="more()"\r
		[disabled]="isBusy || !hasMore">\r
		More\r
	</button>\r
</div>\r
`;var Nd=`lm-admin-message-banner{display:flex;margin-bottom:10px}
/*# sourceMappingURL=tenant-widgets.css.map */
`;var aa,tn=(aa=class extends q{constructor(e,t,i,s,a,o,n){super("AdminTenantWidgetsComponent","widget",a,e,t,s,i,{isFilter:!0,isUserFilter:!1,filters:[{name:"Mobile",propertyName:"includeMobileOnly",value:!0,type:H.Custom}]}),this.adminContext=o,this.viewRef=n,this.includeAll=!1,this.showUnsignedInformation=!1,this.datagridOptions=this.defaultOptions()}ngOnInit(){this.initializing&&this.adminContext.tool$.pipe(he(1)).subscribe(e=>{this.maxCount=e.maxCountTenantWidgets||0,this.isCloud=e.isCloud,this.showUnsignedInformation=e.isUnsignedTenantWidgetsEnabled}),this.showUnsignedInformation&&(this.messageBanner={title:"Installation of unsigned widgets is enabled",message:"IMPORTANT NOTICE: The use of unsigned widgets has been enabled for this tenant. Unsigned widgets have not been reviewed and approved by Infor or an authorized agent thereof so you might experience technical difficulties as a result of their use. Infor is not responsible for any technical difficulties or data loss that occurs through the use of unsigned widgets.",level:ze.Info}),this.refresh()}getDataGrid(){return this.dataGrid}listItems(e){if(this.isBusy)return;let t=this,i=t.adminService;this.setBusy(!0),e&&(this.hasMore=!0,this.paging=null,this.items=[],this.clearSelection());let s=this.orderBy,a={paging:this.paging,pageSize:this.pageSize,sortOrder:s.order,sortBy:s.entity,query:this.query};this.setRequestFilters(a),this.includeAll&&(a.includeAll=!0),i.listTenantWidgets(a).subscribe(o=>{let n=o.content;t.addItems(n,o.paging),t.updateCount(o.count,this.maxCount),t.setBusy(!1)},o=>{t.setBusy(!1),t.onError(o)})}editAccess(){let e=this.getSelectedItem();this.adminService.openWidgetAccessDialog(e,t=>{t&&t.content?this.refresh():this.onError(t)},this.viewRef)}copyAccess(){let e=this.getSelectedItem(),t=this,i=t.adminService;this.setBusy(!0),i.getWidgetAccess({id:e.widgetId,accessList:[]}).subscribe(s=>{t.accessCopy=Mt.getAccessCopy(s.content.accessList),t.setBusy(!1)},s=>{t.adminService.handleError(s),t.setBusy(!1)})}applyAccessCopy(){let e=this.getSelectedItems();this.adminService.applyWidgetAccess(e,this.accessCopy,()=>{this.refresh()})}clearOrReplaceWithAccessCopy(e){let t=this.getSelectedItems();this.adminService.clearOrReplaceWidgetAccess(t,e,()=>{this.refresh()},this.accessCopy)}install(){let e="Install Tenant Widget",t=this.adminService,i={title:e,operation:"importtenantwidget",disclaimer:this.showUnsignedInformation?"DISCLAIMER: If the widget you are attempting to import is unsigned you should cancel this upload unless you trust its source. Infor is not responsible for any technical difficulties or data loss that occurs through the use of unsigned widgets.":null},s=this;t.openImportFilesDialog(i,this.viewRef).subscribe(a=>{let o=a.value;a.button===C.Yes&&o.responseCode===Q.Success?this.adminService.showUploadCompleteDialog(e,o.message).subscribe(n=>{n.button===C.Ok&&s.refresh()}):a.button===C.Yes&&o.responseCode===Q.Fail&&t.showUploadCompleteDialog(e,o.message,!0)})}onClickDelete(){let e=this.getSelectedItems();if(!e||e.length!==1){this.logWarning("Invalid selection count");return}let t=e[0],i={widgetId:t.widgetId,version:t.version,frameworkVersion:t.frameworkVersion},s="Delete Widget",a=this.getDeleteMessage(t);this.showConfirm(s,a).subscribe(()=>{this.deleteWidget(i,s)})}getDeleteMessage(e){let t=e.displayVersion||e.version,i=`Are you sure that you want to remove the widget '${e.title}', with version ${t}?`;return e.isActive&&(i+=" It will be removed for all users, as well as any published widget based on this widget."),i}deleteWidget(e,t){this.setBusy(!0),this.adminService.deleteTenantWidget(e).subscribe(i=>{let s="",a=i.errorList||i.messageList;if(a)for(let o of a)s+=o.message;this.adminService.showUploadCompleteDialog(t,s).subscribe(o=>{o.button===C.Ok&&i.content&&i.content>0&&this.refresh()}),this.setBusy(!1)},i=>{this.setBusy(!1),this.adminService.handleError(i,i.getErrorMessages())})}onExpandRow(e){let t=e.item,i=$(e.detail).find(".datagrid-row-detail-padding").empty(),s=`<div class="datagrid-cell-layout">
				<span class="datagrid-textarea lm-white-space-normal">${this.escape(t.description)}
				<p>Framework version: ${t.frameworkVersion}</p></span>`;t.widgetErrorInfo&&(s+=this.getErrorMessageTemplate(fe.formatError(t.widgetErrorInfo.message))),s+="</div>",$(i).append($(s))}onClickExport(){let e=this.getSelectedItems();if(!e){this.logWarning("No selection to export");return}if(e.length!==1){this.logWarning("Invalid selection to export. Multiselect not supported");return}let t=e[0],i="Export widget",s=`Are you sure that you want to export ${t.title}?`;this.showConfirm(i,s).subscribe(()=>{this.adminService.exportTenantWidget(t)})}onClickViewDetails(){let e=this.getSelectedItem(),t=this.sohoDialogService.modal(Dt,this.viewRef).title("Widget Details").id("lm-a-tw-details-dialog");t.apply(i=>{i.dialog=t,i.widgetId=e.widgetId,i.version=e.version}).open()}getColumns(){let e=this;return[this.getSelectionColumn(),{width:335,id:"adm-sw-col-t",field:"title",name:"Title",sortable:!1,formatter:Formatters.Expander},{width:250,id:"adm-sw-col-wi",field:"widgetId",name:"Widget ID",sortable:!1,formatter:(t,i,s)=>e.items[t].widgetErrorInfo?fe.formatError(s):s},{width:160,id:"adm-sw-col-cd",field:"changeDate",name:"Change date",sortable:!1,formatter:S.date},{width:100,id:"adm-sw-col-s",field:"version",name:"Version",sortable:!1,formatter:(t,i,s)=>e.items[t].displayVersion||e.items[t].version},{width:90,id:"adm-sw-col-ac",field:"isActive",name:"Active",sortable:!1,formatter:(t,i,s)=>e.items[t].isActive?"Yes":"No"},{width:150,id:"adm-sw-col-cbn",field:"changedByName",name:"Changed by",sortable:!1,formatter:S.displayName},{width:110,id:"adm-sw-col-hr",field:"hasRestrictions",name:"Permissions",sortable:!1,formatter:S.restricted}]}getEmptyMessage(){return"No tenant widgets found"}},aa.ctorParameters=()=>[{type:L},{type:y},{type:B},{type:w},{type:b},{type:O},{type:A}],aa.propDecorators={dataGrid:[{type:f,args:["tenantWidgetsDatagrid",{static:!1}]}]},aa);tn=d([p({selector:"lm-admin-tenant-widgets",template:Ld,styles:[Nd]})],tn);var Xn=class{};Xn=d([ur({imports:[gr,fr,yr,br,Ir,Er,Nr],declarations:[Ma,Ks,mi,Oa,Wo,Go,so,Vo,jo,Ba,Ua,Mi,Yo,Ht,en,ia,Qo,ja,ri,ni,za,Ga,Wa,Va,Ya,tn,Xo,$t,La,Li,uo,go,Ao,hi,vi,zo,yi,Uo,fi,No,bi,co,ho,po,eo,At,Wt,oo,no,Lt,fo,yo,Tn,En,ci,ki,Ti,Na,ai,si,oi,ti,ii,ei,Qt,Kt,Yt,xi,Dt,_o,wt,ys,Ja,ot,di,As,Dn,Xa,ks,bo,Ft,Oo,Ns,wn,bs,zt,ms,ps,ts,Ln,On,Rn,_s,Ws,gi,ui,ba,fn,Mn,Gt,Nn,Fs,Co,Io,Zn,yn,qt,Ra,li,An,Ct],providers:[Yt,ki,Ti,Zn,Fs,Co,Io]})],Xn);export{Yt as AccessStatePipe,mi as AddDynamicComponentDialog,xi as AddEditPropertyComponent,Ks as AddTagsComponent,Ma as AdminBulkDeleteComponent,Oa as AdminContainerComponent,O as AdminContext,so as AdminDynamicPagesComponent,Ba as AdminExportComponent,La as AdminFeaturedComponent,Na as AdminHomeComponent,Ua as AdminImportComponent,Mi as AdminImportDialogComponent,ja as AdminMemoListComponent,Ht as AdminPageSelectorComponent,_o as AdminPoliciesComponent,Wo as AdminPrivatePagesComponent,jo as AdminPropertiesComponent,Go as AdminPublishedPagesComponent,ia as AdminPublishedWidgetAboutComponent,en as AdminPublishedWidgetsComponent,y as AdminService,ai as AdminSettingsComponent,Vo as AdminStandardPagesComponent,Qo as AdminStandardWidgetsComponent,Yo as AdminTagsComponent,tn as AdminTenantWidgetsComponent,$t as AdminUserSelectorComponent,Ud as CamelCaseSpacePipe,Li as ChangeOwnerComponent,Kt as DateRangeComponent,Qt as DefaultPagesComponent,uo as DraggableComponent,go as DroppableComponent,Wt as DynamicAccordion,oo as DynamicAccordionHeader,no as DynamicAccordionPane,hi as DynamicImageDialog,Ao as DynamicImageListComponent,Oo as DynamicLinkList,bi as DynamicLinkListDialog,ho as DynamicPageColor,po as DynamicPageEditor,eo as DynamicPageSettingsBasic,At as DynamicPageSettingsDialog,di as DynamicPermissionsComponent,ot as DynamicPermissionsDialogComponent,fi as DynamicTextDialog,No as DynamicTextListComponent,yi as DynamicWebDialog,Uo as DynamicWebListComponent,vi as DynamicWidgetDialog,zo as DynamicWidgetListComponent,Xo as EarlyAccessWidgetsComponent,wt as EditPolicyComponent,Lt as EntityAccessDialogComponent,fo as EntityRefineByPipe,yo as EntitySearchPipe,Xa as InvalidAttributeComponent,Xn as LimeAdminModule,ei as MandatoryPagesComponent,ni as MemoBasicComponent,za as MemoDateComponent,Wa as MemoDateMonthlyComponent,Ga as MemoDateWeeklyComponent,Va as MemoDateYearlyComponent,ri as MemoDialogComponent,li as MemoPreviewDialog,Ya as MemoWeekdaySelectComponent,Ra as MessageBannerComponent,Ja as OperatorPipe,ci as PreviewDialog,ii as RuleAddConnectionComponent,ti as SettingAddEditRuleComponent,oi as SettingDiscardComponent,si as SettingSetValueComponent,Ti as SettingsAreaPipe,ki as SettingsVisibilityPipe,bo as SortableComponent,Dt as WidgetDetailsDialogComponent};
//# sourceMappingURL=chunk-HS4SNERD.js.map
