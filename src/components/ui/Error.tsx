type Props = {
    children: string | ReactElement
  }

function Error({children}: Props) {
    return ( 
        <div className="error">{children}</div>
     );
}

export default Error;