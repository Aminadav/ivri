import { DetailedHTMLProps, DOMAttributes, HTMLAttributes,AriaAttributes } from "react"

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    css?: string
    key?
  }
}