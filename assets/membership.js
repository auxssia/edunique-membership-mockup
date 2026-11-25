/* Membership plans: plan switcher + GSAP motion (mockup, 25 Nov 2026). Works without GSAP. */
(function () {
	var root = document.getElementById('membership');
	if (!root) return;

	var PLANS = [
		{ age: 'Ages 4 to 6', name: 'Ramp Up Scores', price: 3500, href: '/product/ramp-up-scores-100-sessions/',
		  for: 'The first step: three school subjects, early skill courses and brain programmes for young learners.',
		  sessions: 600, tuitions: '3', brain: 2, team: '4 + 1',
		  list: ['<strong>AI-mapped</strong> programme, customised to your child',
		         '<strong>50,000 worksheets</strong>, 25 free books and 50 audio story books',
		         '<strong>3 skill development courses</strong> and 2 brain enhancement programmes',
		         '<strong>Monthly counselling</strong> with a Brain Skill Function Score'] },
		{ age: 'Ages 7 to 8', name: 'Alphaers', price: 5000, href: '/product/alphaers-100-sessions/',
		  for: 'More subjects, more choice: your child picks the skill courses that suit them.',
		  sessions: 800, tuitions: '4', brain: 3, team: '6 + 1',
		  list: ['<strong>AI-mapped</strong> programme, customised to your child',
		         '<strong>1,00,000 worksheets</strong>, 50 free books and 75 audio story books',
		         '<strong>Pick 7 of 12 courses</strong> in skill development and brain enhancement',
		         '<strong>Counselling every two weeks</strong> with a Brain Skill Function Score'] },
		{ age: 'Ages 9 to 10', name: 'Adroitness', price: 7000, href: '/product/adroitness-100-sessions/',
		  for: 'Five subjects and weekly counselling, as school work gets harder.',
		  sessions: 1000, tuitions: '5', brain: 5, team: '8 + 2',
		  list: ['<strong>AI-mapped</strong> programme, customised to your child',
		         '<strong>1,50,000 worksheets</strong>, 75 free books and 100 audio story books',
		         '<strong>Pick 7 of 16 courses</strong> in skill development and brain enhancement',
		         '<strong>Weekly counselling</strong> with a Brain Skill Function Score'] },
		{ age: 'Ages 11 to 12', name: 'Warriors', price: 9000, href: '/product/warriors/',
		  for: 'Every school subject plus languages, with a bigger team behind your child.',
		  sessions: 1200, tuitions: 'All', brain: 7, team: '10 + 2',
		  list: ['<strong>AI-mapped</strong> programme, customised to your child',
		         '<strong>2,00,000 worksheets</strong>, 100 free books and 125 audio story books',
		         '<strong>All subject tuitions and language</strong>, plus 8 of 18 skill and brain courses',
		         '<strong>Weekly counselling</strong> with a Brain Skill Function Score'] },
		{ age: 'Ages 13 and up', name: 'Checkmaters', price: 11000, href: '/product/checkmaters/',
		  for: 'The full plan for teenagers: every subject, the widest course choice and three mentors.',
		  sessions: 1400, tuitions: 'All', brain: 9, team: '12 + 3',
		  list: ['<strong>AI-mapped</strong> programme, customised to your child',
		         '<strong>2,50,000 worksheets</strong>, 125 free books and 150 audio story books',
		         '<strong>All subject tuitions and language</strong>, plus 10 of 18 skill and brain courses',
		         '<strong>Weekly counselling</strong> with a Brain Skill Function Score'] }
	];

	var fmt = function (n) { return Math.round(n).toLocaleString('en-IN'); };
	var f = function (k) { return root.querySelector('[data-f="' + k + '"]'); };
	var btns = root.querySelectorAll('.vp-step-btn');
	var detail = root.querySelector('.vp-detail');
	var hasGsap = typeof window.gsap !== 'undefined';
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var animate = hasGsap && !reduce;
	var current = 0;

	function fill(p) {
		f('age').textContent = p.age;
		f('name').textContent = p.name;
		f('for').textContent = p.for;
		f('href').setAttribute('href', p.href);
		f('tuitions').textContent = p.tuitions;
		f('team').textContent = p.team;
		f('list').innerHTML = p.list.map(function (t) { return '<li><span>' + t + '</span></li>'; }).join('');
	}

	function countTo(el, from, to) {
		if (!animate) { el.textContent = fmt(to); return; }
		var o = { v: from };
		gsap.to(o, { v: to, duration: .9, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } });
	}

	function select(i) {
		if (i === current) return;
		var prev = PLANS[current], p = PLANS[i];
		btns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
		current = i;

		if (!animate) {
			fill(p);
			f('price').textContent = fmt(p.price);
			f('sessions').textContent = fmt(p.sessions);
			f('brain').textContent = p.brain;
			return;
		}
		var dir = i > PLANS.indexOf(prev) ? 1 : -1;
		var tl = gsap.timeline();
		tl.to(root.querySelectorAll('.vp-d-left > *, .vp-list li'), {
			x: -30 * dir, autoAlpha: 0, duration: .18, stagger: .02, ease: 'power2.in'
		})
		.add(function () {
			fill(p);
			countTo(f('price'), prev.price, p.price);
			countTo(f('sessions'), prev.sessions, p.sessions);
			countTo(f('brain'), prev.brain, p.brain);
		})
		.fromTo(root.querySelectorAll('.vp-d-left > *'), { x: 40 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .5, stagger: .05, ease: 'back.out(1.8)' })
		.fromTo(root.querySelectorAll('.vp-list li'), { x: 40 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .45, stagger: .06, ease: 'power3.out' }, '<.1')
		.fromTo(root.querySelectorAll('.vp-stat'), { y: 0 }, { keyframes: { y: [0, -12, 0] }, duration: .5, stagger: .06, ease: 'power2.out' }, '<')
		.fromTo('.vp-price', { rotate: 0 }, { keyframes: { rotate: [-6, 4, -2, 0] }, duration: .6, ease: 'power1.inOut' }, '<');
	}

	btns.forEach(function (b, i) {
		b.addEventListener('click', function () { select(i); });
	});
	// Arrow keys move along the staircase.
	root.querySelector('.vp-stairs').addEventListener('keydown', function (e) {
		var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
		if (!d) return;
		e.preventDefault();
		var n = (current + d + PLANS.length) % PLANS.length;
		btns[n].focus(); select(n);
	});

	if (!animate) return;
	gsap.registerPlugin(ScrollTrigger);

	// Entrance: heading, staircase built one step at a time, then the detail card.
	var path = root.querySelector('.vp-h2 em path');
	var len = path.getTotalLength();
	gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

	var intro = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } });
	intro
		.from('.vp-kicker', { scale: 0, rotate: -30, duration: .6, ease: 'back.out(2.5)' })
		.from('.vp-h2', { y: 50, autoAlpha: 0, duration: .7, ease: 'power3.out' }, '<.1')
		.to(path, { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, '-=.2')
		.from('.vp-head .va-lead', { y: 30, autoAlpha: 0, duration: .6, ease: 'power2.out' }, '<')
		.from('.vp-step', { y: -140, autoAlpha: 0, rotate: function (i) { return i % 2 ? 8 : -8; }, duration: .8, stagger: .12, ease: 'bounce.out' }, '-=.4')
		.from('.vp-step-num', { scale: 0, duration: .4, stagger: .12, ease: 'back.out(3)' }, '-=.7')
		.from('.vp-step-bar i', { scaleX: 0, duration: .8, stagger: .1, ease: 'power3.out' }, '-=.6')
		.add(function () {
			root.querySelectorAll('.vp-step-price b').forEach(function (b) {
				var o = { v: 0 }, to = +b.dataset.count;
				gsap.to(o, { v: to, duration: 1, ease: 'power2.out', onUpdate: function () { b.textContent = '₹' + fmt(o.v); } });
			});
		}, '<')
		.from(detail, { y: 80, autoAlpha: 0, rotate: 1.5, duration: .8, ease: 'back.out(1.4)' }, '-=.5')
		.from('.vp-stat', { scale: .6, autoAlpha: 0, duration: .5, stagger: .07, ease: 'back.out(2.2)' }, '-=.4')
		.from('.vp-list li', { x: 30, autoAlpha: 0, duration: .45, stagger: .07, ease: 'power3.out' }, '<.1');

	gsap.from('.vp-club', { scrollTrigger: { trigger: '.vp-club', start: 'top 88%', once: true }, y: 40, autoAlpha: 0, duration: .7, ease: 'power3.out' });
	gsap.from('.vp-club-badge', { scrollTrigger: { trigger: '.vp-club', start: 'top 88%', once: true }, scale: 0, rotate: -120, duration: .9, delay: .2, ease: 'back.out(2)',
		onComplete: function () { gsap.fromTo('.vp-club-badge', { rotate: -8 }, { rotate: 6, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }); } });

})();
