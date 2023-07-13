import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { HeaderLabel } from './HeaderLabel';
import { VizTooltipHeaderLabelValue } from './VizTooltipHeaderLabelValue';
import { LabelValue } from './tooltipUtils';

interface VizTooltipHeaderProps {
  headerLabel: LabelValue;
  keyValuePairs?: LabelValue[];
  customValueDisplay?: JSX.Element;
}
export const VizTooltipHeader = ({ headerLabel, keyValuePairs, customValueDisplay }: VizTooltipHeaderProps) => {
  const styles = useStyles2(getStyles);

  const renderKeyValue = () => {
    if (customValueDisplay) {
      return customValueDisplay;
    }

    return <VizTooltipHeaderLabelValue keyValuePairs={keyValuePairs} />;
  };
  return (
    <div className={styles.wrapper}>
      <HeaderLabel headerLabel={headerLabel} />
      {renderKeyValue()}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4px;
    //border-bottom: 1px solid ${theme.colors.border.medium};
  `,
});
