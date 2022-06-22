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
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Welke data-type bewaart true or false values?', 'boolean', 'float', 'double', 'int', 'boolean');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Wat is het verschill tussen http en https?', 'https gebruikt SSL (Secure Sockets Layer.)', 'http is een oudere versie van https', 'https kan je niet gebruiken op je locale host', 'https websites zijn onmogelijk te hacken', 'https gebruikt SSL (Secure Sockets Layer.)');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Waarvoor word SMTP gebruikt?', 'emails versturen op een mail server', 'beveiligen van een website', 'opslaan van gegevens op een server', 'protocol om data te versturen', 'emails versturen op een mail server');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Wat zijn ICMP packets?', 'IP packets om data te versturen', 'software packets voor routers', 'command and control data logs', 'error message packets for problemen met IP packets', 'error message packets for problemen met IP packets');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Welke data-type bewaart true or false values?', 'boolean', 'float', 'double', 'int', 'boolean');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Wat is het verschill tussen http en https?', 'https gebruikt SSL (Secure Sockets Layer.)', 'http is een oudere versie van https', 'https kan je niet gebruiken op je locale host', 'https websites zijn onmogelijk te hacken', 'https gebruikt SSL (Secure Sockets Layer.)');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Waarvoor word SMTP gebruikt?', 'emails versturen op een mail server', 'beveiligen van een website', 'opslaan van gegevens op een server', 'protocol om data te versturen', 'emails versturen op een mail server');
INSERT INTO `vraag` (`id`, `naam`, `antwoord_a`, `antwoord_b`, `antwoord_c`, `antwoord_d`, `juiste_antwoord`) VALUES ('', 'Wat zijn ICMP packets?', 'IP packets om data te versturen', 'software packets voor routers', 'command and control data logs', 'error message packets for problemen met IP packets', 'error message packets for problemen met IP packets');
