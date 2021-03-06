import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Button } from 'boot-cell/source/Form/Button';
import { TabView, TabPanel } from 'boot-cell/source/Content/TabView';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';

import { ActivityCard, ActivityGallery } from '../../component';
import { Provider, Registration, session, user } from '../../model';
import style from './Detail.module.less';

const provider_list = Object.entries(Provider).filter(([key]) => isNaN(+key)),
    provider_link = {
        github: (name: string) => 'https://github.com/' + name,
        qq: (name: string) => 'https://user.qzone.qq.com/' + name,
        weibo: (name: string) => 'https://weibo.com/' + name
    };

@observer
@component({
    tagName: 'user-detail',
    renderTarget: 'children'
})
export class UserDetail extends mixin() {
    @attribute
    @watch
    uid = '';

    connectedCallback() {
        this.classList.add('d-block', 'py-5');
        this.style.background =
            'url(https://hacking.kaiyuanshe.cn/static/pic/profile-back-pattern.png)';

        user.getOne(this.uid);

        super.connectedCallback();
    }

    renderIcon = ([key, name]: string[]) => {
        const { name: userName, provider } = user.current;

        return (
            <a target="_blank" href={provider_link[key]?.(userName)}>
                <BGIcon
                    type="square"
                    group="brands"
                    name={name}
                    size="lg"
                    color={provider === key ? 'success' : 'secondary'}
                />
            </a>
        );
    };

    render() {
        const {
            loading,
            current: { id, nickname, avatar_url, profile, likes, registrations }
        } = user;
        const isSelf = session.user?.id === id,
            owns = likes?.filter(({ remark }) => remark === 'creator');

        return (
            <SpinnerBox className="container d-lg-flex" cover={loading}>
                <div className="border bg-white mr-lg-3 mb-3 mb-lg-0">
                    <header className="p-3">
                        <h2 className="text-nowrap">{nickname}</h2>
                        <div className="d-flex">
                            <img className={style.avatar} src={avatar_url} />
                            <span className="text-nowrap">
                                {profile?.career_type}
                            </span>
                        </div>
                    </header>
                    <div className="p-3 border-top text-nowrap">
                        {provider_list.map(this.renderIcon)}
                    </div>
                    {!isSelf ? null : (
                        <div className="p-3 border-top text-center">
                            <Button color="warning" href="user/edit">
                                编辑个人信息
                            </Button>
                        </div>
                    )}
                </div>
                <TabView mode="masthead" tabAlign="center">
                    <NavLink>关注的活动</NavLink>
                    <TabPanel>
                        {likes && (
                            <ActivityGallery
                                list={likes.map(
                                    ({ hackathon_info }) => hackathon_info
                                )}
                            />
                        )}
                    </TabPanel>
                    <NavLink>创建的活动</NavLink>
                    <TabPanel>
                        {owns?.[0] && (
                            <ActivityGallery
                                manage
                                list={owns.map(
                                    ({ hackathon_info }) => hackathon_info
                                )}
                            />
                        )}
                    </TabPanel>
                    <NavLink>参与的活动</NavLink>
                    <TabPanel>
                        {registrations && (
                            <ActivityGallery
                                list={registrations.map(
                                    ({ hackathon_info }) => hackathon_info
                                )}
                            />
                        )}
                    </TabPanel>
                </TabView>
            </SpinnerBox>
        );
    }
}
