import React, { FC } from "react"
import { Button } from "@openneuro/components/button"

/**
 * An edit button, calls action when clicked
 */
interface CancelButtonProps {
  action: () => void
}
export const CancelButton: FC<CancelButtonProps> = ({ action }) => {
  return (
    <Button
      className="description-btn description-button-cancel"
      label="Cancel"
      icon="fas fa-times"
      onClick={() => action()}
    />
  )
}
