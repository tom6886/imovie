$(function () {
    $(".del").click(function () {
        var id = $(this).data("id");

        $.post("/admin/delete", {id: id}, function (r) {
            alert(r.msg);
            window.location.reload();
        }, "json");
    });
});