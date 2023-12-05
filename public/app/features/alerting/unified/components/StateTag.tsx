import { css, cx, keyframes } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export type State = 'good' | 'bad' | 'warning' | 'neutral' | 'info';

type Props = {
  state: State;
  size?: 'md' | 'sm';
  muted?: boolean;
  flapping?: boolean;
};

export const StateTag = ({
  children,
  state,
  size = 'md',
  muted = false,
  flapping = false,
}: React.PropsWithChildren<Props>) => {
  const styles = useStyles2(getStyles);

  return (
    <span
      className={cx(
        styles.common,
        styles[state],
        styles[size],
        { [styles.muted]: muted },
        { [styles.flapping]: flapping }
      )}
    >
      {children || state}
    </span>
  );
};

const flappingPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const getStyles = (theme: GrafanaTheme2) => ({
  common: css({
    display: 'inline-block',
    color: 'white',
    borderRadius: theme.shape.radius.default,
    fontSize: theme.typography.size.sm,
    textTransform: 'capitalize',
    lineHeight: 1.2,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightBold,
  }),
  good: css({
    backgroundColor: theme.colors.success.main,
    border: `solid 1px ${theme.colors.success.main}`,
    color: theme.colors.success.contrastText,
  }),
  warning: css({
    backgroundColor: theme.colors.warning.main,
    border: `solid 1px ${theme.colors.warning.main}`,
    color: theme.colors.warning.contrastText,
  }),
  bad: css({
    backgroundColor: theme.colors.error.main,
    border: `solid 1px ${theme.colors.error.main}`,
    color: theme.colors.error.contrastText,
  }),
  neutral: css({
    backgroundColor: theme.colors.secondary.main,
    border: `solid 1px ${theme.colors.secondary.main}`,
    color: theme.colors.secondary.contrastText,
  }),
  info: css({
    backgroundColor: theme.colors.primary.main,
    border: `solid 1px ${theme.colors.primary.main}`,
    color: theme.colors.primary.contrastText,
  }),
  md: css({
    padding: theme.spacing(0.5, 1),
    minWidth: theme.spacing(8),
  }),
  sm: css({
    padding: theme.spacing(0.3, 0.5),
    minWidth: '52px',
  }),
  muted: css({
    opacity: 0.5,
  }),
  flapping: css({
    animation: `${flappingPulse} 2s infinite`,
    backgroundColor: theme.colors.warning.shade,
    border: `solid 1px ${theme.colors.warning.shade}`,
  }),
});
