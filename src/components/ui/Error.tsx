type Props = {
    children: string
  }

function Error({children}: Props) {
    return ( 
        <div className="error">{children}</div>
     );
}

export default Error;