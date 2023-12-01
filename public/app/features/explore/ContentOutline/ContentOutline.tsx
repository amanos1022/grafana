import { css } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { useToggle, useScroll } from 'react-use';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { useStyles2, PanelContainer, CustomScrollbar } from '@grafana/ui';

import { useContentOutlineContext, ContentOutlineItemContextProps } from './ContentOutlineContext';
import { ContentOutlineItemButton } from './ContentOutlineItemButton';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css({
      label: 'wrapper',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      marginRight: theme.spacing(1),
      height: '100%',
      backgroundColor: theme.colors.background.primary,
    }),
    content: css({
      label: 'content',
      top: 0,
    }),
    buttonStyles: css({
      textAlign: 'left',
      width: '100%',
      padding: theme.spacing(0, 1.5),
    }),
  };
};

export function ContentOutline({ scroller, panelId }: { scroller: HTMLElement | undefined; panelId: string }) {
  const { outlineItems } = useContentOutlineContext();
  const [expanded, toggleExpanded] = useToggle(false);
  const [activeItemId, setActiveItemId] = useState<string | undefined>(outlineItems[0]?.id);
  const styles = useStyles2((theme) => getStyles(theme));
  const scrollerRef = useRef(scroller as HTMLElement);
  const { y: verticalScroll } = useScroll(scrollerRef);
  const directClick = useRef<boolean>(false);

  const scrollIntoView = (ref: HTMLElement | null, buttonTitle: string) => {
    let scrollValue = 0;
    let el: HTMLElement | null | undefined = ref;

    do {
      scrollValue += el?.offsetTop || 0;
      el = el?.offsetParent as HTMLElement;
    } while (el && el !== scroller);

    scroller?.scroll({
      top: scrollValue,
      behavior: 'smooth',
    });

    /* doing this to prevent immediate updates to verticalScroll
    which will cause the useEffect to fire multiple times and 
    set active items at each point of the scroll
    */
    setTimeout(() => {
      directClick.current = false;
    }, 1000);

    reportInteraction('explore_toolbar_contentoutline_clicked', {
      item: 'select_section',
      type: buttonTitle,
    });
  };

  const toggle = () => {
    toggleExpanded();
    reportInteraction('explore_toolbar_contentoutline_clicked', {
      item: 'outline',
      type: expanded ? 'minimize' : 'expand',
    });
  };

  useEffect(() => {
    // TODO: this doesn't work because scrolling will still happen and directClick will be set to false

    if (directClick.current) {
      return;
    }

    const activeItem = outlineItems.find((item) => {
      const top = item?.ref?.getBoundingClientRect().top;

      if (!top) {
        return false;
      }

      return top >= 0;
    });

    if (!activeItem) {
      return;
    }

    setActiveItemId(activeItem.id);
  }, [outlineItems, verticalScroll]);

  const handleDirectClick = (item: ContentOutlineItemContextProps) => {
    directClick.current = true;
    setActiveItemId(item.id);
    scrollIntoView(item.ref, item.title);
  };

  return (
    <PanelContainer className={styles.wrapper} id={panelId}>
      <CustomScrollbar>
        <div className={styles.content}>
          <ContentOutlineItemButton
            title={expanded ? 'Collapse outline' : undefined}
            icon={expanded ? 'angle-left' : 'angle-right'}
            onClick={toggle}
            tooltip={!expanded ? 'Expand content outline' : undefined}
            className={styles.buttonStyles}
            aria-expanded={expanded}
          />

          {outlineItems.map((item) => {
            return (
              <ContentOutlineItemButton
                key={item.id}
                title={expanded ? item.title : undefined}
                className={styles.buttonStyles}
                icon={item.icon}
                onClick={() => {
                  handleDirectClick(item);
                }}
                tooltip={!expanded ? item.title : undefined}
                isActive={activeItemId === item.id}
              />
            );
          })}
        </div>
      </CustomScrollbar>
    </PanelContainer>
  );
}
