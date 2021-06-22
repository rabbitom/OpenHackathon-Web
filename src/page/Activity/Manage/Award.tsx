import {
    WebCellProps,
    component,
    mixin,
    attribute,
    watch,
    createCell
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Table, TableRow } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { Image } from 'boot-cell/source/Media/Image';

import { AdminFrame } from '../../../component/AdminFrame';
import menu from './menu.json';
import { activity } from '../../../model';
import { Award } from '../../../model/Award';

export interface ManageAwardProps extends WebCellProps {
    name: string;
}

@observer
@component({
    tagName: 'manage-award',
    renderTarget: 'children'
})
export class ManageAward extends mixin<ManageAwardProps>() {
    @attribute
    @watch
    name = '';

    async connectedCallback() {
        const { name } = this;

        super.connectedCallback();

        if (name !== activity.current.name) await activity.getOne(name);

        await activity.award.getNextPage({}, true);
    }

    renderItem = ({
        quantity,
        target,
        pictures: [photo],
        name,
        description
    }: Award) => (
        <TableRow>
            <td>{quantity}</td>
            <td>{target}</td>
            <td>
                <Image fluid src={photo.uri} />
            </td>
            <td>{name}</td>
            <td>{description}</td>
            <td>
                <Button size="sm" color="danger">
                    删除
                </Button>
            </td>
        </TableRow>
    );

    render({ name }: ManageAwardProps) {
        const { award } = activity;

        return (
            <AdminFrame menu={menu} name={name}>
                <Table className="mt-2" small center>
                    <TableRow type="head">
                        <th>权重</th>
                        <th>类型</th>
                        <th>照片</th>
                        <th>名称</th>
                        <th>描述</th>
                        <th>操作</th>
                    </TableRow>

                    {award?.list.map(this.renderItem)}
                </Table>
            </AdminFrame>
        );
    }
}
