create table vraag
(
    id              int auto_increment,
    naam            varchar(255) not null,
    antwoord_a      varchar(255) null,
    antwoord_b      varchar(255) not null,
    antwoord_c      varchar(255) null,
    antwoord_d      varchar(255) null,
    juiste_antwoord varchar(255) not null,
    constraint vraag_pk
        primary key (id)
);
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 1', 'test A', 'test B', 'test C', 'test D', 'test B');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test A');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test yeet');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test vraag');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 1', 'test A', 'test B', 'test C', 'test D', 'test B');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test A');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test yeet');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Vraag 2', 'test A', 'test B', 'test C', 'test D', 'test vraag');
