use strict; use warnings; use utf8;
my ($src, $out) = @ARGV;
local $/;
open my $t, '<:utf8', "$src/_top.html" or die; my $top = <$t>;
open my $b, '<:utf8', "$src/_bottom.html" or die; my $bot = <$b>;
for my $f (glob "$src/[a-z]*.html") {
  open my $fh, '<:utf8', $f or die; my $c = <$fh>;
  $c =~ s/\A---\n(.*?)\n---\n//s or die "no front matter in $f";
  my %m = map { /^(\w+):\s*(.*)$/ ? ($1, $2) : () } split /\n/, $1;
  my $h = $top;
  $h =~ s/\{\{TITLE\}\}/$m{TITLE}/g; $h =~ s/\{\{DESC\}\}/$m{DESC}/g;
  my $hc = $m{HEADER} // ''; $h =~ s/\{\{HEADER_CLASS\}\}/$hc/g;
  $h =~ s/\{\{A_(\w+)\}\}/$1 eq $m{PAGE} ? ' is-active' : ''/ge;
  (my $name = $f) =~ s{.*/}{};
  open my $o, '>:utf8', "$out/$name" or die; print $o $h . $c . $bot; close $o;
  print "built $name\n";
}
