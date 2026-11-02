-- Programme de base : 3 langues x 5 niveaux (prix en MAD, à ajuster)
insert into programs (language, level, title, hours, price_group_mad, price_individual_mad)
select l::language_code, v::cefr_level,
  case l when 'fr' then 'Français ' when 'en' then 'Anglais ' else 'Espagnol ' end || v,
  40, 1500, 4000
from unnest(array['fr', 'en', 'es']) as l, unnest(array['A1', 'A2', 'B1', 'B2', 'C1']) as v
on conflict (language, level) do nothing;
