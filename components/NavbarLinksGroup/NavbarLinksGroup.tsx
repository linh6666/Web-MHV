'use client';
import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';

type TablerIconType = typeof IconChevronRight;

interface LinksGroupProps {
  icon: TablerIconType;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
  active: string;
  onActiveChange: (value: string) => void;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
  active,
  onActiveChange,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  // các link con
  const items = (hasLinks ? links : []).map((l) => (
    <Text<'a'>
      component="a"
      key={l.label}
      href={l.link}
      className={`${classes.link} ${active === l.link ? classes.active : ''}`} // thêm class active cho link con
      onClick={(event) => {
        event.preventDefault();
        onActiveChange(l.link);
      }}
    >
      {l.label}
    </Text>
  ));

  const handleMainClick = (event: React.MouseEvent) => {
    if (!hasLinks && link) {
      event.preventDefault();
      onActiveChange(link);
    } else {
      setOpened((o) => !o);
    }
  };

  return (
    <>
      <UnstyledButton
        onClick={handleMainClick}
        className={`${classes.control} ${active === link ? classes.active : ''}`} // thêm class active cho menu cha
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

