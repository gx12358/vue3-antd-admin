<template>
  <g-pro-page-container :contentStyle="{ position: 'relative' }">
    <g-doc :anchorLinks="links">
      <a-typography id="proCard">
        <a-typography-title :level="2" :style="{ color: '#454d64' }">
          ProCard 高级卡片
          <a style="font-size: 14px" href="https://procomponents.ant.design/components/card">
            （参照react-pro-components：ProCard）
          </a>
        </a-typography-title>
      </a-typography>
      <BasicCard />
      <GridCard />
      <ResponsiveCard />
      <SplitCard />
      <ColumnsCard />
      <ComplexSplitCard />
      <GridSpaceCard />
      <MultiLineCard />
      <GroupCard />
      <HeaderDivider />
      <CollapsedCard />
      <DeckExpandCard />
      <CenterCard />
      <LoadingCard />
      <ActionsCard />
      <HideTitleCard />
      <BorderedCard />
      <HoverableCard />
      <TabsCard />
      <CardTab />
      <InnerCard />
      <StepsCard />
      <BasicApi />
      <ProCardTabs />
      <ProCardTabPane />
      <ProCardTabDivider />
      <ProCardTabGroup />
    </g-doc>
    <g-back-top />
  </g-pro-page-container>
</template>

<script lang="ts" setup>
import BasicCard from './components/BasicCard.vue'
import GridCard from './components/GridCard.vue'
import ResponsiveCard from './components/ResponsiveCard.vue'
import SplitCard from './components/SplitCard.vue'
import ColumnsCard from './components/ColumnsCard.vue'
import ComplexSplitCard from './components/ComplexSplitCard.vue'
import GridSpaceCard from './components/GridSpaceCard.vue'
import MultiLineCard from './components/MultiLineCard.vue'
import GroupCard from './components/GroupCard.vue'
import HeaderDivider from './components/HeaderDivider.vue'
import CollapsedCard from './components/CollapsedCard.vue'
import DeckExpandCard from './components/DeckExpandCard.vue'
import CenterCard from './components/CenterCard.vue'
import LoadingCard from './components/LoadingCard.vue'
import ActionsCard from './components/ActionsCard.vue'
import HideTitleCard from './components/HideTitleCard.vue'
import BorderedCard from './components/BorderedCard.vue'
import HoverableCard from './components/HoverableCard.vue'
import TabsCard from './components/TabsCard.vue'
import CardTab from './components/CardTab.vue'
import InnerCard from './components/InnerCard.vue'
import StepsCard from './components/StepsCard.vue'
import BasicApi from './components/BasicApi.vue'
import ProCardTabs from './components/ProCardTabs.vue'
import ProCardTabPane from './components/ProCardTabPane.vue'
import ProCardTabDivider from './components/ProCardTabDivider.vue'
import ProCardTabGroup from './components/ProCardTabGroup.vue'
import { links } from './utils/config'
</script>
