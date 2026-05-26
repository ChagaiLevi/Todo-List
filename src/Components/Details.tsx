import { type DetailsProps } from "../scripts/types.ts";

const Details: React.FC<DetailsProps> = ({ detailsPopup, detailsPopupRef, transitionInProgressRef, setDetailsPopup }) => {
  return (
    <>
      {detailsPopup.isMounted && (
        <div
          ref={detailsPopupRef}
          id="details-popup"
          className={detailsPopup.isVisible ? "show" : ""}
          style={{
            display: "block",
            position: "fixed",
            zIndex: 2000,
            left: `${detailsPopup.left}px`,
            top: `${detailsPopup.top}px`,
            background: "rgba(5, 5, 5, 0.95)",
            backdropFilter: "blur(20px)",
            padding: "12px 18px",
            borderRadius: "10px",
            color: "#00e7ff",
            boxShadow: "0 0 25px rgba(0, 231, 255, 0.6)",
            border: "1px solid rgba(0, 231, 255, 0.2)",
            fontSize: "0.95rem",
            textAlign: "center",
            lineHeight: 1.35,
            minWidth: "135px",
            boxSizing: "border-box",
          }}
          onTransitionEnd={(event) => {
            if (event.propertyName !== "opacity") return;

            if (detailsPopup.isVisible) {
              transitionInProgressRef.current = false;
              return;
            }

            setDetailsPopup((prev) => ({ ...prev, isMounted: false }));
            transitionInProgressRef.current = false;
          }}
        >
          Details:
          <br />
          {detailsPopup.detailsDate}
          <br />
          {detailsPopup.detailsTime}
        </div>
      )}
    </>
  )
}

export default Details