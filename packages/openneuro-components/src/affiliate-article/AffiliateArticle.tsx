import React from 'react'

export interface AffiliateArticleProps {
  logo?: string
  header?: string
  contentOne?: Record<string, any>
  contentTwo?: Record<string, any>
}

export const AffiliateArticle: React.FC<AffiliateArticleProps> = ({
  logo,
  header,
  contentOne,
  contentTwo,
  ...props
}) => {
  return (
    <div className="affiliate-card" {...props}>
      {logo ? <img src={logo} alt="" loading="lazy" /> : null}
      {header ? <h2>{header}</h2> : null}
      {contentOne ? <div>{contentOne}</div> : null}
      {contentTwo ? <span>{contentTwo}</span> : null}
    </div>
  )
}
