function renderValue(value: any) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((item, index) => (
          <div key={index} className="ml-3 border-l pl-3">
            {typeof item === "object" && item !== null
              ? Object.entries(item).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="font-medium">{k}:</span> {String(v)}
                  </div>
                ))
              : String(item)}
          </div>
        ))}
      </div>
    )
  }

  // Object
  if (typeof value === "object") {
    return (
      <div className="space-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="text-sm">
            <span className="font-medium">{k}:</span> {String(v)}
          </div>
        ))}
      </div>
    )
  }

  // Primitive
  return String(value)
}