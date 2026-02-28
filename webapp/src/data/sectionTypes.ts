export type SectionGroup = {
  label: string
  html: string
}

export type SectionTab = {
  id: string
  label: string
  panelId: string
  groups: SectionGroup[]
}

export type SectionContent = {
  slug: string
  file: string
  title: string
  tabs: SectionTab[]
}

