import { Designator } from "@api/types/designators";
import { Checkbox } from "@mantine/core";

interface TableDesignatorItemProps {
  designator: Designator;
  isSelected: boolean;
  setSelectedDesignators: React.Dispatch<React.SetStateAction<Designator[]>>;
  updateEditDesignatorForm: (designator: Designator) => void;
  hasCRUDAccess: boolean;
}

export default function TableDesignatorItem({
  designator,
  isSelected,
  setSelectedDesignators,
  updateEditDesignatorForm,
  hasCRUDAccess,
}: TableDesignatorItemProps) {
  return (
    <tr>
      <td>{designator.name}</td>

      {hasCRUDAccess && (
        <td>
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                setSelectedDesignators((prev) => {
                  if (prev.length === 0) {
                    updateEditDesignatorForm(designator);
                    return [designator];
                  }

                  return [...prev, designator];
                });
                return;
              }
              setSelectedDesignators((prev) =>
                prev.filter((item) => item.id !== designator.id)
              );
            }}
          />
        </td>
      )}
      <td>{designator.workDescription}</td>
      <td>{designator.isMaterial ? "Material" : "Jasa"}</td>
      <td>{designator.unit}</td>
      <td>{designator.pricePerUnit}</td>
    </tr>
  );
}
