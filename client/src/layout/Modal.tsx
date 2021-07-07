import React from "react";

interface ModalProps {
    show: boolean

    onClose(): void
    title: React.ReactChild

    style?: Pick<React.CSSProperties, "color" | "backgroundColor"> & {headerColor: string, headerBackgroundColor: string}
}

export function Modal(props: React.PropsWithChildren<ModalProps>) {
    const {show, title, children, onClose, style} = props;

    const realStyle = {};
    if(style?.backgroundColor) realStyle["--background"] = style.backgroundColor
    if(style?.color) realStyle["--color"] = style.color
    if(style?.headerColor) realStyle["--highlight-color"] = style.color
    if(style?.headerBackgroundColor) realStyle["--highlight-background"] = style.color

    return (
      <div className={`modal ${show ? "show" : ""}`} style={realStyle}>
          <div className="body">
                <div className="header">
                    {title}
                    <div className="fill" />
                    <button type="button" className="close-button" onClick={onClose}>
                        <svg width="1em" height="1em" viewBox="0 0 10 10" strokeWidth={2} style={{backgroundColor: "transparent", stroke: "white"}}>
                            <line x1="1" y1="2" x2="9" y2="10" />
                            <line x1="9" y1="2" x2="1" y2="10" />
                        </svg>
                    </button>
                </div>
                <div className="content">
                    {children}
                </div>
          </div>
      </div>  
    );
}