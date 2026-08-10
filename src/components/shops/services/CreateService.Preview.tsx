export function ServicePreviewPanel() {
  return (
    <div className="max-w-xs rounded-2xl bg-muted p-3.5">
      <div className="overflow-hidden rounded-2xl border border-input bg-card">
        <div className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground">
          Ảnh dịch vụ
        </div>

        <div className="p-3.5 text-foreground">
          <span className="inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            Danh mục
          </span>

          <p className="mt-2 text-[15px] font-semibold">Tên dịch vụ</p>
          <p className="text-[12.5px] text-muted-foreground">từ 0đ · 0 phút</p>

          <div className="mt-3 border-t border-input pt-3">
            <p className="mb-2 text-[12.5px] font-semibold">
              Tên nhóm tuỳ chọn
              <span className="ml-1 text-destructive">*</span>
            </p>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                className="flex items-center justify-between rounded-lg border border-secondary bg-secondary/10 px-2.5 py-1.5 text-left text-[12.5px]"
              >
                <span>Lựa chọn 1</span>
                <span className="text-muted-foreground">+0đ</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-between rounded-lg border border-input bg-card px-2.5 py-1.5 text-left text-[12.5px] hover:bg-muted"
              >
                <span>Lựa chọn 2</span>
                <span className="text-muted-foreground">+0đ</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t border-input pt-3 text-[12.5px]">
            <span className="text-muted-foreground">Tổng cộng</span>
            <span className="font-semibold">0đ · 0 phút</span>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-primary py-2.5 text-[13.5px] font-medium text-primary-foreground"
          >
            Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicePreviewPanel;
