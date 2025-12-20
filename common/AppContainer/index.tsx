import React, { ReactNode } from "react";
import classes from "./AppContainer.module.css";

const AppContainer: React.FC<AppContainerProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className={`${classes.root} ${className}`} {...otherProps}>
      {children}
    </div>
  );
};

type AppContainerProps = {
  children?: ReactNode;
  className?: string;
};

export default AppContainer;